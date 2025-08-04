const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

class RailwayBackupManager {
  constructor() {
    this.config = {
      // Usar la URL de deploy de Railway desde tu .env
      dbUrl: process.env.DB_DEPLOY,
      backupDir: path.join(__dirname, '..', 'backups'),
      retentionDays: parseInt(process.env.RETENTION_DAYS) || 30
    };
    
    console.log('🔧 Configuración de backup:', {
      dbUrl: this.config.dbUrl ? 'Configurada ✅' : 'No configurada ❌',
      backupDir: this.config.backupDir,
      retentionDays: this.config.retentionDays
    });
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = ['daily', 'manual', 'weekly', 'pre-deploy'];
    dirs.forEach(dir => {
      const fullPath = path.join(this.config.backupDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Directorio creado: ${fullPath}`);
      }
    });
  }

  getTimestamp() {
    const now = new Date();
    return now.toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .split('.')[0];
  }

  async createBackup(type = 'manual', reason = 'manual') {
    if (!this.config.dbUrl) {
      throw new Error('❌ DB_DEPLOY no está configurado en .env');
    }

    const timestamp = this.getTimestamp();
    const fileName = `backup_${reason}_${timestamp}`;
    const backupPath = path.join(this.config.backupDir, type);
    
    console.log(`🔄 Iniciando backup ${type} desde Railway...`);
    console.log(`📝 Razón: ${reason}`);
    console.log(`📂 Directorio: ${backupPath}`);

    // Archivos de backup
    const dumpFile = path.join(backupPath, `${fileName}.dump`);
    const sqlFile = path.join(backupPath, `${fileName}.sql`);

    // Comandos para backup desde Railway
    const dumpCommand = `pg_dump "${this.config.dbUrl}" --no-password --format=custom --compress=9 --file="${dumpFile}"`;
    const sqlCommand = `pg_dump "${this.config.dbUrl}" --no-password --file="${sqlFile}"`;

    try {
      console.log('⏳ Creando backup .dump...');
      await this.executeCommand(dumpCommand);
      console.log(`✅ Backup .dump creado: ${fileName}.dump`);

      console.log('⏳ Creando backup .sql...');
      await this.executeCommand(sqlCommand);
      console.log(`✅ Backup .sql creado: ${fileName}.sql`);

      // Verificar tamaño de los archivos
      const dumpStats = fs.statSync(dumpFile);
      const sqlStats = fs.statSync(sqlFile);

      console.log(`📊 Tamaño backup .dump: ${this.formatBytes(dumpStats.size)}`);
      console.log(`📊 Tamaño backup .sql: ${this.formatBytes(sqlStats.size)}`);

      // Verificar integridad del backup
      console.log('🔍 Verificando integridad del backup...');
      const verifyCommand = `pg_restore --list "${dumpFile}"`;
      await this.executeCommand(verifyCommand);
      console.log(`✅ Backup verificado correctamente`);

      return {
        success: true,
        files: [dumpFile, sqlFile],
        sizes: {
          dump: dumpStats.size,
          sql: sqlStats.size
        },
        timestamp
      };

    } catch (error) {
      console.error(`❌ Error en backup: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        timestamp
      };
    }
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      console.log(`🔧 Ejecutando: ${command.replace(this.config.dbUrl, '[DB_URL_HIDDEN]')}`);

      exec(command, { timeout: 300000 }, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error ejecutando comando: ${error.message}`);
          reject(error);
        } else {
          if (stderr) {
            console.log(`ℹ️ Info: ${stderr}`);
          }
          resolve(stdout);
        }
      });
    });
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async cleanOldBackups(type = 'daily') {
    const backupPath = path.join(this.config.backupDir, type);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    console.log(`🧹 Limpiando backups antiguos de ${type}...`);
    console.log(`📅 Eliminando archivos anteriores a: ${cutoffDate.toLocaleDateString()}`);

    try {
      if (!fs.existsSync(backupPath)) {
        console.log(`📂 Directorio ${type} no existe, saltando limpieza`);
        return;
      }

      const files = fs.readdirSync(backupPath);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(backupPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`🗑️ Eliminado backup antiguo: ${file}`);
        }
      }

      console.log(`✅ Limpieza completada: ${deletedCount} archivos eliminados`);
    } catch (error) {
      console.error(`❌ Error en limpieza: ${error.message}`);
    }
  }

  async dailyBackup() {
    console.log(`📅 Ejecutando backup diario...`);
    const result = await this.createBackup('daily', 'daily');
    if (result.success) {
      await this.cleanOldBackups('daily');
    }
    return result;
  }

  async preDeployBackup() {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    console.log(`🚀 Ejecutando backup pre-deploy...`);
    return await this.createBackup('pre-deploy', `pre_deploy_${today}`);
  }

  async listRecentBackups(type = 'daily', limit = 5) {
    const backupPath = path.join(this.config.backupDir, type);
    
    if (!fs.existsSync(backupPath)) {
      console.log(`📂 No existen backups de tipo: ${type}`);
      return [];
    }

    const files = fs.readdirSync(backupPath)
      .filter(file => file.endsWith('.dump'))
      .map(file => {
        const filePath = path.join(backupPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          date: stats.mtime
        };
      })
      .sort((a, b) => b.date - a.date)
      .slice(0, limit);

    console.log(`📋 Últimos ${limit} backups de ${type}:`);
    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file.name}`);
      console.log(`   📊 Tamaño: ${this.formatBytes(file.size)}`);
      console.log(`   📅 Fecha: ${file.date.toLocaleString()}`);
      console.log('');
    });

    return files;
  }
}

// Script ejecutable
if (require.main === module) {
  const backup = new RailwayBackupManager();
  const action = process.argv[2] || 'manual';
  const reason = process.argv[3] || action;

  async function runBackup() {
    try {
      switch (action) {
        case 'daily':
          await backup.dailyBackup();
          break;
        case 'pre-deploy':
          await backup.preDeployBackup();
          break;
        case 'list':
          await backup.listRecentBackups(reason || 'daily');
          break;
        default:
          await backup.createBackup('manual', reason);
      }
      console.log('🎉 Operación completada exitosamente');
    } catch (error) {
      console.error('💥 Error:', error.message);
      process.exit(1);
    }
  }

  runBackup();
}

module.exports = RailwayBackupManager;
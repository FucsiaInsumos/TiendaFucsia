const RailwayBackupManager = require('./railway-backup');
const fs = require('fs');
const path = require('path');

async function checkBackupStatus() {
  console.log('🔍 Verificando estado de backups...\n');
  
  const backup = new RailwayBackupManager();
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  // Verificar backup de hoy
  const dailyDir = path.join(__dirname, '..', 'backups', 'daily');
  if (fs.existsSync(dailyDir)) {
    const files = fs.readdirSync(dailyDir);
    const todayBackups = files.filter(file => file.includes(today));
    
    if (todayBackups.length > 0) {
      console.log('✅ Backup de hoy encontrado:');
      todayBackups.forEach(file => {
        const filePath = path.join(dailyDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   📁 ${file}`);
        console.log(`   📊 Tamaño: ${backup.formatBytes(stats.size)}`);
        console.log(`   📅 Creado: ${stats.birthtime.toLocaleString()}`);
      });
    } else {
      console.log('❌ No hay backup de hoy');
    }
  }
  
  console.log('\n📋 Resumen de backups:');
  const types = ['daily', 'manual', 'pre-deploy'];
  
  for (const type of types) {
    const typeDir = path.join(__dirname, '..', 'backups', type);
    if (fs.existsSync(typeDir)) {
      const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.dump'));
      console.log(`   ${type}: ${files.length} backups`);
    } else {
      console.log(`   ${type}: 0 backups`);
    }
  }
}

if (require.main === module) {
  checkBackupStatus();
}
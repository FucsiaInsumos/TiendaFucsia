const bcrypt = require('bcrypt');

/**
 * Crea el usuario genérico para ventas locales si no existe
 */
const ensureGenericUser = async () => {
  try {
    const { User } = require('../data');
    
    const existingGeneric = await User.findByPk('GENERIC_001');
    
    if (!existingGeneric) {
      console.log('🔧 Creando usuario genérico para POS...');
      
      await User.create({
        n_document: 'GENERIC_001',
        first_name: 'Cliente',
        last_name: 'Local',
        email: 'cliente@pos.local',
        password: await bcrypt.hash('generic_pos_user_2024', 10),
        role: 'Customer',
        isActive: true,
        wlegalorganizationtype: 'person',
        stributaryidentificationkey: 'O-1',
        sfiscalresponsibilities: 'R-99-PN',
        sfiscalregime: '48'
      });
      
      console.log('✅ Usuario genérico creado para ventas locales');
    } else {
      console.log('👤 Usuario genérico ya existe');
    }
  } catch (error) {
    console.error('⚠️ Error verificando usuario genérico:', error.message);
    // No lanzar error para no romper el servidor
  }
};

/**
 * Función principal de inicialización de datos del sistema
 */
const initializeSystemData = async () => {
  console.log('🔄 Inicializando datos del sistema...');
  
  try {
    // Crear usuario genérico
    await ensureGenericUser();
    
    // Aquí puedes agregar más inicializaciones en el futuro:
    // - Roles por defecto
    // - Configuraciones iniciales
    // - Categorías base
    // - etc.
    
    console.log('✅ Inicialización del sistema completada');
  } catch (error) {
    console.error('❌ Error en inicialización del sistema:', error.message);
    throw error;
  }
};

module.exports = {
  ensureGenericUser,
  initializeSystemData
};
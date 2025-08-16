// Definición de permisos por rol (usando los roles del modelo User)
const permisos = {
  Owner: {
    permisos: [
      'verEstadisticas',
      'crearCategoria',
      'editarCategoria',
      'eliminarCategoria',
      'crearProducto',
      'editarProducto',
      'eliminarProducto',
      'gestionarUsuarios',
      'crearVenta',
      'verProductos',
      'gestionarDistribuidores',
      'verReportes'
    ]
  },
  Distributor: {
    permisos: [
      'crearCategoria',
      'editarCategoria',
      'crearProducto',
      'editarProducto',
      'verEstadisticas',
      'verProductos',
      'crearVenta'
    ]
  },
  Cashier: {
    permisos: [
      'verProductos',
      'crearVenta',
      'verEstadisticas',
      'gestionarUsuarios',   
      'editarProducto'
    ]
  },
  Customer: {
    permisos: [
      'verProductos'
    ]
  }
};

// Middleware para verificar y asignar permisos según el rol
const byRol = (req, res, next) => {
  try {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        error: true,
        message: 'Usuario o rol no definido'
      });
    }

    const userRole = req.user.role;

    if (!permisos[userRole]) {
      return res.status(403).json({
        error: true,
        message: 'Rol no válido'
      });
    }

    // Asignar permisos del usuario al request para uso posterior
    req.userPermissions = permisos[userRole].permisos;
    req.role = userRole;

    next();
  } catch (error) {
    console.error('Error en middleware byRol:', error);
    return res.status(500).json({
      error: true,
      message: 'Error al verificar rol'
    });
  }
};

module.exports = {
  byRol,
  permisos
};
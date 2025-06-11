const { permisos } = require('../middleware/byRol');

const checkPermissions = (permisosRequeridos) => {
  return (req, res, next) => {
    try {
      // Asegurarse de que req.user y req.user.role existen
      if (!req.user || !req.user.role) {
        console.error('Error en verificación de permisos: req.user o req.user.role no definidos.');
        return res.status(403).json({
          error: true,
          message: 'Acceso denegado. Información de usuario no disponible.'
        });
      }

      const rolUsuario = req.user.role;
      
      // Verificar que el rol exista en la configuración de permisos y tenga un array de permisos
      if (!permisos[rolUsuario] || !Array.isArray(permisos[rolUsuario].permisos)) {
        console.error(`Error en verificación de permisos: Rol "${rolUsuario}" no encontrado o sin permisos definidos.`);
        return res.status(403).json({
          error: true,
          message: 'Acceso denegado. Rol o permisos no configurados correctamente.'
        });
      }
      
      const permisosUsuario = permisos[rolUsuario].permisos;

      const tienePermiso = permisosRequeridos.every(permiso => 
        permisosUsuario.includes(permiso)
      );

      if (!tienePermiso) {
        return res.status(403).json({
          error: true,
          message: 'No tienes los permisos necesarios'
        });
      }

      next();
    } catch (error) {
      console.error('Error en verificación de permisos:', error);
      res.status(500).json({
        error: true,
        message: 'Error al verificar permisos'
      });
    }
  };
};

module.exports = { checkPermissions };
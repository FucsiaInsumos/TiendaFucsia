const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Distributor} = require('../../data');
const { generateToken } = require('../../middleware/isAuth');



const register = async (req, res) => {
  try {
    console.log('Datos recibidos para registro:', req.body);
    
    const { email, password, n_document, ...userData } = req.body;

    // Validaciones básicas
    if (!email || !password || !n_document) {
      return res.status(400).json({ 
        error: true, 
        message: 'Email, contraseña y número de documento son requeridos' 
      });
    }

    // Verificar si el correo ya existe
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      console.log('Email ya existe:', email);
      return res.status(400).json({ error: true, message: 'El correo ya está registrado' });
    }

    // Verificar si el documento ya existe
    const existingUserByDocument = await User.findOne({ where: { n_document } });
    if (existingUserByDocument) {
      console.log('Documento ya existe:', n_document);
      return res.status(400).json({ error: true, message: 'El número de documento ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      ...userData,
      n_document,
      email,
      password: hashedPassword
    });

    console.log('Usuario creado exitosamente:', newUser.n_document);

    // Remover la contraseña del objeto de respuesta
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;

    // Generar token JWT
    const token = generateToken(newUser);

    res.status(201).json({
      error: false,
      message: 'Usuario registrado exitosamente',
      data: { token, user: userResponse }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      console.log('Errores de validación:', validationErrors);
      return res.status(400).json({ 
        error: true, 
        message: 'Errores de validación', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe e incluir información del distribuidor
    const user = await User.findOne({ 
      where: { email },
      include: [
        {
          model: Distributor,
          as: 'distributor',
          required: false
        }
      ]
    });
    
    if (!user) {
      return res.status(400).json({ error: true, message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: true, message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = generateToken(user);

    // Crear respuesta sin la contraseña
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.json({
      error: false,
      message: 'Login exitoso',
      data: { token, user: userResponse }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

const logout = async (req, res) => {
  try {
    // En JWT, el logout se maneja principalmente en el frontend
    // Aquí podríamos añadir lógica adicional como:
    // - Registrar la acción de logout en logs
    // - Invalidar el token en una blacklist (si usamos una)
    // - Limpiar datos de sesión adicionales

    res.json({
      error: false,
      message: 'Logout exitoso',
      data: null
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

module.exports = {
  register,
  login,
  logout
};
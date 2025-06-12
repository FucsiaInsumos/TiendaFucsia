const bcrypt = require('bcrypt');
const { User, Distributor } = require('../../data');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    
    const whereClause = {};
    if (role) whereClause.role = role;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Distributor,
          as: 'distributor',
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      error: false,
      message: 'Usuarios obtenidos exitosamente',
      data: {
        users: users.rows,
        totalUsers: users.count,
        totalPages: Math.ceil(users.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Distributor,
          as: 'distributor',
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    }

    res.json({
      error: false,
      message: 'Usuario obtenido exitosamente',
      data: { user }
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

const createUserFromDashboard = async (req, res) => {
  try {
    const { email, password, n_document, role, ...userData } = req.body;

    // Verificar si el correo ya existe
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ error: true, message: 'El correo ya está registrado' });
    }

    // Verificar si el documento ya existe
    const existingUserByDocument = await User.findOne({ where: { n_document } });
    if (existingUserByDocument) {
      return res.status(400).json({ error: true, message: 'El número de documento ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      ...userData,
      n_document,
      email,
      password: hashedPassword,
      role
    });

    // Si es distribuidor, crear registro en tabla Distributor
    if (role === 'Distributor') {
      const { discountPercentage = 0, creditLimit = 0, paymentTerm = 30, minimumPurchase = 0 } = req.body;
      
      await Distributor.create({
        userId: newUser.n_document,
        discountPercentage,
        creditLimit,
        paymentTerm,
        minimumPurchase
      });
    }

    // Remover la contraseña del objeto de respuesta
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;

    res.status(201).json({
      error: false,
      message: 'Usuario creado exitosamente',
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        error: true, 
        message: 'Errores de validación', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, role, ...updateData } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    }

    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Actualizar usuario
    await user.update({ ...updateData, role });

    // Manejar cambios de rol a/desde Distribuidor
    if (role === 'Distributor' && user.role !== 'Distributor') {
      // Crear registro de distribuidor si no existe
      const existingDistributor = await Distributor.findOne({ where: { userId: id } });
      if (!existingDistributor) {
        const { discountPercentage = 0, creditLimit = 0, paymentTerm = 30, minimumPurchase = 0 } = req.body;
        await Distributor.create({
          userId: id,
          discountPercentage,
          creditLimit,
          paymentTerm,
          minimumPurchase
        });
      }
    } else if (role !== 'Distributor' && user.role === 'Distributor') {
      // Eliminar registro de distribuidor si cambió de rol
      await Distributor.destroy({ where: { userId: id } });
    }

    // Obtener usuario actualizado
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Distributor,
          as: 'distributor',
          required: false
        }
      ]
    });

    res.json({
      error: false,
      message: 'Usuario actualizado exitosamente',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        error: true, 
        message: 'Errores de validación', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    }

    // Soft delete usando paranoid
    await user.destroy();

    res.json({
      error: false,
      message: 'Usuario eliminado exitosamente',
      data: null
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUserFromDashboard,
  updateUser,
  deleteUser
};

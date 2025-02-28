const { Category } = require('../../data'); // Asegúrate de exportar Category desde tu archivo de modelos/índice

// Crear una nueva categoría
const createCategory = async (req, res) => {
  try {
    const { name, description, isActive, parentId } = req.body;

    // Si se envía un parentId, verificar que la categoría padre exista
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(404).json({
          error: true,
          message: 'Categoría padre no encontrada'
        });
      }
    }

    const newCategory = await Category.create({
      name,
      description,
      isActive: isActive !== undefined ? isActive : true,
      parentId: parentId || null
    });

    return res.status(201).json({
      error: false,
      message: 'Categoría creada exitosamente',
      data: newCategory
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todas las categorías (con la posibilidad de incluir subcategorías si las definiste)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          association: 'subcategories', // Asegúrate de definir esta asociación si la usas en tu modelo
          required: false
        }
      ]
    });

    return res.status(200).json({
      error: false,
      message: 'Categorías obtenidas exitosamente',
      data: categories
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener una categoría por id (incluyendo sus subcategorías, opcionalmente)
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [
        {
          association: 'subcategories',
          required: false
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        error: true,
        message: 'Categoría no encontrada'
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Categoría obtenida exitosamente',
      data: category
    });
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar una categoría existente
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive, parentId } = req.body;

    // Buscar la categoría
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        error: true,
        message: 'Categoría no encontrada'
      });
    }

    // Si se envía parentId, verificar que exista y que no se esté asignando a sí misma
    if (parentId) {
      if (parentId === id) {
        return res.status(400).json({
          error: true,
          message: 'La categoría no puede ser padre de sí misma'
        });
      }
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(404).json({
          error: true,
          message: 'Categoría padre no encontrada'
        });
      }
    }

    // Actualizar la categoría
    await category.update({
      name: name || category.name,
      description: description || category.description,
      isActive: isActive !== undefined ? isActive : category.isActive,
      parentId: parentId !== undefined ? parentId : category.parentId
    });

    return res.status(200).json({
      error: false,
      message: 'Categoría actualizada correctamente',
      data: category
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        error: true,
        message: 'Categoría no encontrada'
      });
    }

    // Puedes considerar validar si la categoría tiene subcategorías o productos asociados
    await category.destroy();

    return res.status(200).json({
      error: false,
      message: 'Categoría eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

const filterCategories = async (req, res) => {
    try {
      const { name } = req.query;
  
      let filter = {};
      if (name) {
        filter.name = {
          [Op.iLike]: `%${name}%`  // Utiliza iLike para búsqueda insensible a mayúsculas/minúsculas (funciona con Postgres)
        };
      }
  
      const categories = await Category.findAll({
        where: filter,
        include: [
          {
            association: 'subcategories',
            required: false
          }
        ]
      });
  
      return res.status(200).json({
        error: false,
        message: 'Categorías filtradas exitosamente',
        data: categories
      });
    } catch (error) {
      console.error('Error al filtrar categorías:', error);
      return res.status(500).json({
        error: true,
        message: 'Error interno del servidor'
      });
    }
  };
  

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  filterCategories
};
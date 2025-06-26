const { Category, Product } = require('../../data');
const { Op } = require('sequelize');

// Crear una nueva categoría
const createCategory = async (req, res) => {
  try {
    const { name, description, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ error: true, message: 'El nombre de la categoría es requerido.' });
    }

    // Verificar si la categoría padre existe, si se proporciona parentId
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(404).json({ error: true, message: 'La categoría padre no fue encontrada.' });
      }
    }

    const newCategory = await Category.create({ name, description, parentId, isActive: true });
    return res.status(201).json({ error: false, message: 'Categoría creada exitosamente.', data: newCategory });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: true, message: 'Ya existe una categoría con ese nombre.' });
    }
    return res.status(500).json({ error: true, message: 'Error interno del servidor.' });
  }
};

// Obtener todas las categorías con su jerarquía
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { parentId: null }, // Obtener solo categorías de nivel superior
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: [ // Para incluir sub-subcategorías y así sucesivamente (ajustar profundidad si es necesario)
            {
              model: Category,
              as: 'subcategories',
              include: [{ model: Category, as: 'subcategories' }] // Ejemplo de 3 niveles
            }
          ]
        }
      ],
      order: [['name', 'ASC']]
    });
    return res.status(200).json({ error: false, data: categories });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return res.status(500).json({ error: true, message: 'Error interno del servidor.' });
  }
};

// Obtener todas las categorías planas (sin jerarquía anidada) - alternativa más simple
const getCategoriesFlat = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Category,
          as: 'parentCategory',
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });
    return res.status(200).json({ error: false, data: categories });
  } catch (error) {
    console.error('Error al obtener categorías planas:', error);
    return res.status(500).json({ error: true, message: 'Error interno del servidor.' });
  }
};

// Obtener una categoría por ID con su jerarquía
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: [
            {
              model: Category,
              as: 'subcategories',
            }
          ]
        },
        {
          model: Category,
          as: 'parentCategory' // Para ver el padre si es una subcategoría
        }
      ]
    });

    if (!category) {
      return res.status(404).json({ error: true, message: 'Categoría no encontrada.' });
    }
    return res.status(200).json({ error: false, data: category });
  } catch (error) {
    console.error('Error al obtener categoría por ID:', error);
    return res.status(500).json({ error: true, message: 'Error interno del servidor.' });
  }
};

// Actualizar una categoría
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parentId, isActive } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: true, message: 'Categoría no encontrada.' });
    }

    // Evitar que una categoría sea su propio padre
    if (parentId && parentId === id) {
        return res.status(400).json({ error: true, message: 'Una categoría no puede ser su propio padre.' });
    }

    // Verificar si la categoría padre existe, si se proporciona parentId
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(404).json({ error: true, message: 'La categoría padre no fue encontrada.' });
      }
    }
    
    // No permitir desactivar una categoría si tiene productos activos asociados
    if (isActive === false) {
        const activeProductsCount = await Product.count({ where: { categoryId: id, isActive: true } });
        if (activeProductsCount > 0) {
            return res.status(400).json({ error: true, message: 'No se puede desactivar la categoría porque tiene productos activos asociados.' });
        }
        // Considerar también subcategorías activas
        const activeSubcategoriesCount = await Category.count({ where: { parentId: id, isActive: true } });
        if (activeSubcategoriesCount > 0) {
            return res.status(400).json({ error: true, message: 'No se puede desactivar la categoría porque tiene subcategorías activas.' });
        }
    }


    await category.update({ 
        name: name || category.name, 
        description: description !== undefined ? description : category.description, 
        parentId: parentId !== undefined ? parentId : category.parentId,
        isActive: isActive !== undefined ? isActive : category.isActive
    });

    return res.status(200).json({ error: false, message: 'Categoría actualizada exitosamente.', data: category });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: true, message: 'Ya existe otra categoría con ese nombre.' });
    }
    return res.status(500).json({ error: true, message: 'Error interno del servidor.' });
  }
};

// Eliminar una categoría (eliminación lógica o física)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: true, message: 'Categoría no encontrada.' });
    }

    // Verificar si hay productos asociados a esta categoría
    const productsInCategory = await Product.count({ where: { categoryId: id } });
    if (productsInCategory > 0) {
      return res.status(400).json({ error: true, message: 'No se puede eliminar la categoría porque tiene productos asociados. Considere desactivarla o reasignar los productos.' });
    }

    // Verificar si hay subcategorías asociadas
    const subcategories = await Category.count({ where: { parentId: id } });
    if (subcategories > 0) {
      return res.status(400).json({ error: true, message: 'No se puede eliminar la categoría porque tiene subcategorías. Elimine o reasigne las subcategorías primero.' });
    }

    await category.destroy(); // Eliminación física
    // Para eliminación lógica: await category.update({ isActive: false });

    return res.status(200).json({ error: false, message: 'Categoría eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return res.status(500).json({ error: true, message: 'Error interno del servidor.' });
  }
};

// Obtener categorías simplificadas para Excel/Exportación
const getCategoriesForExport = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'parentId'],
      where: { isActive: true },
      include: [
        {
          model: Category,
          as: 'parentCategory',
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });

    // Formatear datos para Excel
    const exportData = categories.map(category => ({
      id: category.id,
      name: category.name,
      parentCategoryName: category.parentCategory ? category.parentCategory.name : 'CATEGORIA PRINCIPAL',
      level: category.parentId ? 'SUBCATEGORIA' : 'CATEGORIA PRINCIPAL'
    }));

    return res.status(200).json({ 
      error: false, 
      message: 'Categorías para exportación obtenidas exitosamente',
      data: exportData 
    });
  } catch (error) {
    console.error('Error al obtener categorías para exportación:', error);
    return res.status(500).json({ error: true, message: 'Error interno del servidor.' });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoriesFlat,
  getCategoriesForExport,
  getCategoryById,
  updateCategory,
  deleteCategory
};

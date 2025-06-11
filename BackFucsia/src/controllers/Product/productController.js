const { Op } = require('sequelize');
const { Product, Category } = require('../../data');
const { uploadToCloudinary } = require('../../utils/cloudinaryUploader');

// Crear un producto nuevo
const createProduct = async (req, res) => {
  try {
    const { 
      name, description, purchasePrice, price, stock, minStock, 
      isPromotion, promotionPrice, categoryId, tags, sku, specificAttributes 
    } = req.body;

    // Verificar que la categoría exista
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        error: true,
        message: 'Categoría no encontrada'
      });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.path, 'fucsia-products');
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error('Error al subir imagen a Cloudinary:', uploadError);
        }
      }
    } else if (req.body.image_url) {
      imageUrls = Array.isArray(req.body.image_url) ? req.body.image_url : [req.body.image_url];
    }

    // Crear el producto
    const product = await Product.create({
      sku,
      name,
      description,
      purchasePrice,
      price,
      stock,
      minStock,
      isPromotion,
      promotionPrice,
      categoryId,
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      image_url: imageUrls,
      specificAttributes: specificAttributes ? (typeof specificAttributes === 'string' ? JSON.parse(specificAttributes) : specificAttributes) : null,
      isActive: true
    });

    return res.status(201).json({
      error: false,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: true,
        message: 'Error al crear el producto: SKU ya existe.',
        details: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          include: [
            { model: Category, as: 'subcategories' }
          ]
        }
      ]
    });

    return res.status(200).json({
      error: false,
      message: 'Productos obtenidos exitosamente',
      data: products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un producto por su id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          include: [
            { model: Category, as: 'subcategories' }
          ]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado'
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Producto obtenido exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, description, purchasePrice, price, stock, minStock, 
      isPromotion, promotionPrice, categoryId, tags, sku, specificAttributes, isActive 
    } = req.body;

    // Verificar la existencia del producto
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado'
      });
    }

    // Si se actualiza la categoría, verificar que la nueva categoría exista
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          error: true,
          message: 'Categoría no encontrada'
        });
      }
    }
    
    let imageUrls = product.image_url || [];
    if (req.files && req.files.length > 0) {
      imageUrls = [];
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.path, 'fucsia-products');
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error('Error al subir imagen a Cloudinary:', uploadError);
        }
      }
    } else if (req.body.image_url_delete) {
      const urlsToDelete = Array.isArray(req.body.image_url_delete) ? req.body.image_url_delete : [req.body.image_url_delete];
      imageUrls = imageUrls.filter(url => !urlsToDelete.includes(url));
    } else if (req.body.image_url_add) {
      const urlsToAdd = Array.isArray(req.body.image_url_add) ? req.body.image_url_add : [req.body.image_url_add];
      imageUrls = [...new Set([...imageUrls, ...urlsToAdd])];
    }

    // Preparar datos para actualizar con validaciones
    const updateData = {};
    
    if (sku !== undefined) updateData.sku = sku;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (purchasePrice !== undefined && purchasePrice !== '') updateData.purchasePrice = parseFloat(purchasePrice);
    if (price !== undefined && price !== '') updateData.price = parseFloat(price);
    if (stock !== undefined && stock !== '') updateData.stock = parseInt(stock);
    if (minStock !== undefined && minStock !== '') updateData.minStock = parseInt(minStock);
    if (isPromotion !== undefined) updateData.isPromotion = isPromotion;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Manejar promotionPrice - convertir string vacío a null
    if (promotionPrice !== undefined) {
      updateData.promotionPrice = promotionPrice === '' || promotionPrice === null ? null : parseFloat(promotionPrice);
    }
    
    // Manejar tags
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? JSON.parse(tags) : []);
    }
    
    // Manejar specificAttributes
    if (specificAttributes !== undefined) {
      updateData.specificAttributes = typeof specificAttributes === 'string' ? JSON.parse(specificAttributes) : specificAttributes;
    }
    
    // Actualizar URLs de imágenes
    updateData.image_url = imageUrls;

    // Actualizar el producto
    await product.update(updateData);

    return res.status(200).json({
      error: false,
      message: 'Producto actualizado correctamente',
      data: product
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: true,
        message: 'Error al actualizar el producto: SKU ya existe para otro producto.',
        details: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado'
      });
    }

    await product.destroy();

    return res.status(200).json({
      error: false,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Endpoint para filtrar productos
const filterProducts = async (req, res) => {
  try {
    const { categoryId, minPrice, maxPrice, name } = req.query;

    let filters = {};
    if (categoryId) {
      filters.categoryId = categoryId;
    }
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) {
        filters.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice) {
        filters.price[Op.lte] = parseFloat(maxPrice);
      }
    }
    if (name) {
      filters.name = {
        [Op.iLike]: `%${name}%`
      };
    }

    const products = await Product.findAll({
      where: filters,
      include: [
        {
          model: Category,
          as: 'category',
          include: [
            { model: Category, as: 'subcategories' }
          ]
        }
      ]
    });

    return res.status(200).json({
      error: false,
      message: 'Productos filtrados exitosamente',
      data: products
    });
  } catch (error) {
    console.error('Error al filtrar productos:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts
};
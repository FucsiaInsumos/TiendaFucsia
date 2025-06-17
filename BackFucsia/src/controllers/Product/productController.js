const { Product, Category, StockMovement, User, Distributor } = require('../../data'); // Asegúrate que User y Distributor estén aquí
const { Op } = require('sequelize');
const { uploadToCloudinary } = require('../../utils/cloudinaryUploader');

// Crear un producto nuevo
const createProduct = async (req, res) => {
  try {
    const { 
      name, description, purchasePrice, price, distributorPrice, stock, minStock, 
      isPromotion, isFacturable, promotionPrice, categoryId, tags, sku, specificAttributes 
    } = req.body;

     if (isFacturable) {
      if (!purchasePrice || purchasePrice <= 0) {
        return res.status(400).json({
          error: true,
          message: 'Los productos facturables requieren un precio de compra válido'
        });
      }
    }

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
      distributorPrice: distributorPrice || null,
      stock,
      minStock,
      isPromotion,
      isFacturable: isFacturable || false,
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
            // ✅ INCLUIR CATEGORÍA PADRE
            { 
              model: Category, 
              as: 'parentCategory', // ✅ AGREGAR ESTO
              include: [
                {
                  model: Category,
                  as: 'parentCategory' // ✅ Para subcategorías de tercer nivel si existen
                }
              ]
            },
            // Mantener subcategorías
            { 
              model: Category, 
              as: 'subcategories',
              include: [
                {
                  model: Category,
                  as: 'subcategories' // Para subcategorías anidadas
                }
              ]
            }
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
            // ✅ INCLUIR CATEGORÍA PADRE
            { 
              model: Category, 
              as: 'parentCategory', // ✅ AGREGAR ESTO
              include: [
                {
                  model: Category,
                  as: 'parentCategory' // ✅ Para subcategorías de tercer nivel si existen
                }
              ]
            },
            // Mantener subcategorías
            { 
              model: Category, 
              as: 'subcategories',
              include: [
                {
                  model: Category,
                  as: 'subcategories' // Para subcategorías anidadas
                }
              ]
            }
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
      name, description, purchasePrice, price, distributorPrice, stock, minStock, 
      isPromotion, isFacturable, promotionPrice, categoryId, tags, sku, specificAttributes, isActive 
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
    if (distributorPrice !== undefined) {
      updateData.distributorPrice = distributorPrice === '' || distributorPrice === null ? null : parseFloat(distributorPrice);
    }
    if (stock !== undefined && stock !== '') updateData.stock = parseInt(stock);
    if (minStock !== undefined && minStock !== '') updateData.minStock = parseInt(minStock);
    if (isPromotion !== undefined) updateData.isPromotion = isPromotion;
    if (isFacturable !== undefined) updateData.isFacturable = isFacturable;
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
    const { categoryId, minPrice, maxPrice, name, isFacturable } = req.query;

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
     if (isFacturable !== undefined) {
      filters.isFacturable = isFacturable === 'true';
    }

    const products = await Product.findAll({
      where: filters,
      include: [
        {
          model: Category,
          as: 'category',
          include: [
            // ✅ INCLUIR CATEGORÍA PADRE
            { 
              model: Category, 
              as: 'parentCategory',
              include: [
                {
                  model: Category,
                  as: 'parentCategory'
                }
              ]
            },
            // Mantener subcategorías
            { 
              model: Category, 
              as: 'subcategories',
              include: [
                {
                  model: Category,
                  as: 'subcategories'
                }
              ]
            }
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

// Calcular precio con descuentos aplicables
const calculateProductPrice = async (req, res) => {
  try {
    const { items, userType = 'customers', userId = null } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Se requiere un array de items válido'
      });
    }

    const results = [];
    let subtotal = 0;
    let totalDiscount = 0;

    // Validar si es distribuidor y obtener datos
    let distributor = null;
    if (userType === 'distributors' && userId) {
      distributor = await Distributor.findOne({ where: { userId } });
    }

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({
          error: true,
          message: 'Cada item debe tener productId y quantity válidos'
        });
      }

      // Obtener producto
      const product = await Product.findByPk(productId, {
        include: [{ model: Category, as: 'category' }]
      });

      if (!product) {
        return res.status(404).json({
          error: true,
          message: `Producto con ID ${productId} no encontrado`
        });
      }

      // Determinar precio base
      let basePrice = product.price;
      let priceType = 'regular';

      // Si es distribuidor y tiene precio especial
      if (userType === 'distributors' && product.distributorPrice && distributor) {
        basePrice = product.distributorPrice;
        priceType = 'distributor';
      }

      // Si está en promoción
      if (product.isPromotion && product.promotionPrice) {
        if (!product.distributorPrice || product.promotionPrice < basePrice) {
          basePrice = product.promotionPrice;
          priceType = 'promotion';
        }
      }

      const itemTotal = quantity * basePrice;
      subtotal += itemTotal;

      // Buscar descuentos aplicables
      const applicableDiscounts = await findApplicableDiscounts(
        productId,
        product.categoryId,
        quantity,
        itemTotal,
        userType
      );

      let itemDiscount = 0;
      let appliedRule = null;

      if (applicableDiscounts.length > 0) {
        const bestDiscount = applicableDiscounts[0];
        itemDiscount = bestDiscount.discountAmount;
        appliedRule = {
          id: bestDiscount.ruleId,
          name: bestDiscount.ruleName,
          type: bestDiscount.discountType,
          value: bestDiscount.discountValue
        };
        totalDiscount += itemDiscount;
      }

      results.push({
        productId,
        productName: product.name,
        quantity,
        basePrice,
        priceType,
        itemTotal,
        itemDiscount,
        finalPrice: itemTotal - itemDiscount,
        appliedRule,
        isFacturable: product.isFacturable
      });
    }

    // Validar mínimo de compra para distribuidores
    let minimumPurchaseValidation = { valid: true };
    if (userType === 'distributors' && distributor) {
      const finalTotal = subtotal - totalDiscount;
      if (finalTotal < distributor.minimumPurchase) {
        minimumPurchaseValidation = {
          valid: false,
          message: `Monto mínimo de compra requerido: $${distributor.minimumPurchase}`,
          minimumRequired: distributor.minimumPurchase,
          currentTotal: finalTotal,
          missing: distributor.minimumPurchase - finalTotal
        };
      }
    }

     const facturableItems = results.filter(item => item.isFacturable);
    const nonFacturableItems = results.filter(item => !item.isFacturable);
    const facturableTotal = facturableItems.reduce((sum, item) => sum + item.finalPrice, 0);
    const nonFacturableTotal = nonFacturableItems.reduce((sum, item) => sum + item.finalPrice, 0);

    return res.status(200).json({
      error: false,
      message: 'Precios calculados exitosamente',
      data: {
        items: results,
        summary: {
          subtotal,
          totalDiscount,
          total: subtotal - totalDiscount,
          userType,
          minimumPurchaseValidation,
          billing: {
            hasFacturableItems: facturableItems.length > 0,
            facturableItemsCount: facturableItems.length,
            nonFacturableItemsCount: nonFacturableItems.length,
            facturableTotal,
            nonFacturableTotal
          }
        }
      }
    });

  } catch (error) {
    console.error('Error al calcular precios:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};




// Función auxiliar para encontrar descuentos aplicables
const findApplicableDiscounts = async (productId, categoryId, quantity, itemTotal, userType) => {
  try {
    const rules = await DiscountRule.findAll({
      where: {
        isActive: true,
        applicableFor: { [Op.in]: ['all', userType] },
        [Op.or]: [
          { productId: productId },
          { categoryId: categoryId },
          { productId: null, categoryId: null }
        ],
        [Op.or]: [
          { startDate: null },
          { startDate: { [Op.lte]: new Date() } }
        ],
        [Op.or]: [
          { endDate: null },
          { endDate: { [Op.gte]: new Date() } }
        ]
      },
      order: [['priority', 'DESC']]
    });

    const applicableDiscounts = [];

    for (const rule of rules) {
      let applies = false;

      switch (rule.conditionType) {
        case 'quantity':
          applies = quantity >= (rule.minQuantity || 0) && 
                   (rule.maxQuantity ? quantity <= rule.maxQuantity : true);
          break;
        case 'amount':
          applies = itemTotal >= (rule.minAmount || 0) && 
                   (rule.maxAmount ? itemTotal <= rule.maxAmount : true);
          break;
        case 'both':
          applies = quantity >= (rule.minQuantity || 0) && 
                   itemTotal >= (rule.minAmount || 0) &&
                   (rule.maxQuantity ? quantity <= rule.maxQuantity : true) &&
                   (rule.maxAmount ? itemTotal <= rule.maxAmount : true);
          break;
      }

      if (applies) {
        let discountAmount = 0;
        if (rule.discountType === 'percentage') {
          discountAmount = itemTotal * (rule.discountValue / 100);
        } else {
          discountAmount = Math.min(rule.discountValue, itemTotal);
        }

        applicableDiscounts.push({
          ruleId: rule.id,
          ruleName: rule.name,
          discountAmount,
          discountType: rule.discountType,
          discountValue: rule.discountValue
        });
      }
    }

    return applicableDiscounts;
  } catch (error) {
    console.error('Error al buscar descuentos aplicables:', error);
    return [];
  }
};

const getFacturableProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        isFacturable: true,
        isActive: true
      },
      include: [
        {
          model: Category,
          as: 'category',
          include: [
            { 
              model: Category, 
              as: 'parentCategory',
              include: [
                {
                  model: Category,
                  as: 'parentCategory'
                }
              ]
            },
            { 
              model: Category, 
              as: 'subcategories',
              include: [
                {
                  model: Category,
                  as: 'subcategories'
                }
              ]
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Productos facturables obtenidos exitosamente',
      data: {
        products,
        totalProducts: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener productos facturables:', error);
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
  filterProducts,
  calculateProductPrice,
  getFacturableProducts
  // calculatePrice, 
};
const { Product, Category, StockMovement, User, Distributor } = require('../../data'); // Asegúrate que User y Distributor estén aquí
const { Op } = require('sequelize');
const { uploadToCloudinary } = require('../../utils/cloudinaryUploader');

// Crear un producto nuevo
const createProduct = async (req, res) => {
  try {
    const { 
      name, description, purchasePrice, price, distributorPrice, stock, minStock, 
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
      distributorPrice: distributorPrice || null,
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
      name, description, purchasePrice, price, distributorPrice, stock, minStock, 
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
    if (distributorPrice !== undefined) {
      updateData.distributorPrice = distributorPrice === '' || distributorPrice === null ? null : parseFloat(distributorPrice);
    }
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
        appliedRule
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
          minimumPurchaseValidation
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


// // Nueva función para calcular precios CORREGIDA
// const calculatePrice = async (req, res) => {
//   try {
//     const { items, userId } = req.body; 

//     console.log('🧮 [Calculator] Iniciando cálculo de precios');
//     console.log('📦 [Calculator] Items recibidos:', items);
//     console.log('👤 [Calculator] Usuario ID:', userId);

//     // Estructura de respuesta por defecto
//     const defaultResponseData = {
//       items: [],
//       subtotal: 0,
//       totalDiscount: 0,
//       total: 0,
//       isDistributor: false,
//       distributorInfo: null,
//       orderValueForDistributorCheck: 0,
//       appliedDistributorPrices: false,
//       appliedDiscounts: [],
//       savings: 0
//     };

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(200).json({ 
//         error: false,
//         message: 'No se proporcionaron items para calcular.',
//         data: defaultResponseData
//       });
//     }

//     // Obtener datos del usuario
//     const customer = userId ? await User.findByPk(userId, {
//       include: [{ model: Distributor, as: 'distributor', required: false }]
//     }) : null;

//     console.log('👤 [Calculator] Usuario cargado:', {
//       id: customer?.id,
//       role: customer?.role,
//       hasDistributor: !!customer?.distributor,
//       distributorInfo: customer?.distributor ? {
//         discountPercentage: customer.distributor.discountPercentage,
//         minimumPurchase: customer.distributor.minimumPurchase
//       } : null
//     });

//     // Primera pasada: Obtener productos y calcular valor para chequeo de mínimo
//     let orderValueForDistributorCheck = 0;
//     const itemsWithProducts = [];

//     for (const item of items) {
//       const product = await Product.findByPk(item.productId);
//       if (!product) {
//         throw new Error(`Producto ${item.productId} no encontrado.`);
//       }

//       let priceForDistributorCheck = parseFloat(product.price);

//       // Aplicar promoción si es mejor
//       if (product.isPromotion && product.promotionPrice && parseFloat(product.promotionPrice) < priceForDistributorCheck) {
//         priceForDistributorCheck = parseFloat(product.promotionPrice);
//       }

//       // Si es distribuidor, usar precio de distribuidor para el chequeo si es mejor
//       if (customer?.role === 'Distributor' && product.distributorPrice && parseFloat(product.distributorPrice) < priceForDistributorCheck) {
//         priceForDistributorCheck = parseFloat(product.distributorPrice);
//       }

//       orderValueForDistributorCheck += item.quantity * priceForDistributorCheck;

//       itemsWithProducts.push({
//         ...item,
//         productData: product
//       });
//     }

//     // Determinar si aplicar precios de distribuidor
//     let applyDistributorPrices = false;
//     let distributorMinimumRequired = 0;

//     if (customer?.role === 'Distributor' && customer?.distributor) {
//       distributorMinimumRequired = parseFloat(customer.distributor.minimumPurchase) || 0;
      
//       console.log(`💼 [Calculator] Chequeo distribuidor: valor=${orderValueForDistributorCheck}, mínimo=${distributorMinimumRequired}`);
      
//       if (distributorMinimumRequired <= 0 || orderValueForDistributorCheck >= distributorMinimumRequired) {
//         applyDistributorPrices = true;
//         console.log(`✅ [Calculator] Aplicando precios de distribuidor`);
//       } else {
//         console.log(`❌ [Calculator] No se aplican precios de distribuidor - Mínimo no cumplido`);
//       }
//     }

//     // Segunda pasada: Aplicar precios finales
//     const processedItems = [];
//     let subtotal = 0;

//     for (const pItem of itemsWithProducts) {
//       const product = pItem.productData;
//       let finalUnitPrice = parseFloat(product.price);
//       let itemIsPromotion = false;
//       let itemIsDistributorPrice = false;

//       console.log(`🔄 [Calculator] Procesando ${product.name}:`);
//       console.log(`   Precio base: ${finalUnitPrice}`);

//       // Aplicar promoción si es mejor
//       if (product.isPromotion && product.promotionPrice && parseFloat(product.promotionPrice) < finalUnitPrice) {
//         finalUnitPrice = parseFloat(product.promotionPrice);
//         itemIsPromotion = true;
//         console.log(`   ✅ Aplicando promoción: ${finalUnitPrice}`);
//       }

//       // Aplicar precio distribuidor si corresponde y es mejor
//       if (applyDistributorPrices && product.distributorPrice && parseFloat(product.distributorPrice) < finalUnitPrice) {
//         finalUnitPrice = parseFloat(product.distributorPrice);
//         itemIsDistributorPrice = true;
//         itemIsPromotion = false; // Precio distribuidor anula promoción
//         console.log(`   ✅ Aplicando precio distribuidor: ${finalUnitPrice}`);
//       }

//       const itemTotal = finalUnitPrice * pItem.quantity;
//       subtotal += itemTotal;

//       processedItems.push({
//         productId: pItem.productId,
//         quantity: pItem.quantity,
//         name: product.name,
//         sku: product.sku,
//         unitPrice: finalUnitPrice,
//         itemTotal,
//         isPromotion: itemIsPromotion,
//         isDistributorPrice: itemIsDistributorPrice,
//         originalPrice: parseFloat(product.price)
//       });

//       console.log(`   💰 Precio final: ${finalUnitPrice} x ${pItem.quantity} = ${itemTotal}`);
//     }

//     console.log(`🧮 [Calculator] Subtotal calculado: ${subtotal}`);

//     // Aplicar reglas de descuento automáticas
//     const discountResult = await applyDiscountRules(processedItems, customer);
//     const totalDiscount = discountResult.totalDiscount;
//     const appliedDiscounts = discountResult.appliedDiscounts;

//     // Calcular total final
//     const total = subtotal - totalDiscount;

//     // Calcular ahorros (diferencia con precios originales)
//     const originalTotal = processedItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
//     const savings = originalTotal - total;

//     console.log(`💰 [Calculator] Resumen final:`);
//     console.log(`   Subtotal: ${subtotal}`);
//     console.log(`   Descuento reglas: ${totalDiscount}`);
//     console.log(`   Total: ${total}`);
//     console.log(`   Ahorro total: ${savings}`);

//     // Preparar respuesta
//     const responseData = {
//       items: processedItems,
//       subtotal,
//       totalDiscount,
//       total,
//       isDistributor: customer?.role === 'Distributor',
//       distributorInfo: customer?.distributor ? {
//         discountPercentage: customer.distributor.discountPercentage || 0,
//         minimumPurchase: distributorMinimumRequired
//       } : null,
//       orderValueForDistributorCheck,
//       appliedDistributorPrices: applyDistributorPrices,
//       appliedDiscounts,
//       savings: Math.max(0, savings)
//     };

//     res.status(200).json({
//       error: false,
//       message: 'Precios calculados exitosamente.',
//       data: responseData
//     });

//   } catch (error) {
//     console.error('❌ [Calculator] Error:', error);
    
//     const errorResponseData = {
//       items: [],
//       subtotal: 0,
//       totalDiscount: 0,
//       total: 0,
//       isDistributor: false,
//       distributorInfo: null,
//       orderValueForDistributorCheck: 0,
//       appliedDistributorPrices: false,
//       appliedDiscounts: [],
//       savings: 0
//     };

//     res.status(500).json({
//       error: true,
//       message: 'Error interno del servidor al calcular precios.',
//       details: error.message,
//       data: errorResponseData
//     });
//   }
// };

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

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts,
  calculateProductPrice,
  // calculatePrice, 
};
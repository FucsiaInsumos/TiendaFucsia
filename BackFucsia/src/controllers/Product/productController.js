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

// Nueva función para calcular precios (ejemplo básico)
const calculatePrice = async (req, res) => {
  try {
    const { items, userId } = req.body; 

    // Estructura de respuesta por defecto en caso de no haber items o error temprano
    const defaultResponseData = {
      items: [],
      subtotal: 0,
      taxes: 0,
      total: 0,
      isDistributor: false,
      distributorMinimumRequired: 0,
      distributorOrderValueForCheck: 0,
      isDistributorMinimumMet: true,
      distributorPricesApplied: false,
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      // Devolver la estructura por defecto si no hay items
      return res.status(200).json({ 
        error: false, // No es un error del servidor, simplemente no hay nada que calcular
        message: 'No se proporcionaron ítems para calcular.',
        data: defaultResponseData
      });
    }

    let subtotal = 0;
    const pricedItems = [];
    let orderValueForDistributorMinimumCheck = 0;
    let isDistributorMinimumMet = true; 
    let distributorMinimumRequiredValue = 0;
    let distributorPricesAppliedInCalc = false;

    const customer = userId ? await User.findByPk(userId, {
      include: [{ model: Distributor, as: 'distributor', required: false }]
    }) : null;

    // Primera pasada: Calcular precios potenciales y el valor para el chequeo del mínimo de distribuidor
    const itemsForPass1Promises = items.map(item => { // Renombrado para claridad
      return Product.findByPk(item.productId).then(product => {
        if (!product) {
          throw new Error(`Producto ${item.productId} no encontrado.`);
        }
        
        let priceForDistributorCheck = product.price;
        let isPromotion = false;

        if (product.isPromotion && product.promotionPrice && product.promotionPrice < priceForDistributorCheck) {
          priceForDistributorCheck = product.promotionPrice;
          isPromotion = true;
        }

        if (customer?.role === 'Distributor' && customer?.distributor && product.distributorPrice) {
          if (product.distributorPrice < priceForDistributorCheck) {
            priceForDistributorCheck = product.distributorPrice;
          }
        }
        orderValueForDistributorMinimumCheck += item.quantity * priceForDistributorCheck;
        
        return {
          ...item,
          productData: product,
          isPromotionAppliedInitially: isPromotion,
        };
      });
    });

    const resolvedItemsPass1 = await Promise.all(itemsForPass1Promises);

    if (customer?.role === 'Distributor' && customer?.distributor) {
      distributorMinimumRequiredValue = parseFloat(customer.distributor.minimumPurchase) || 0;
      if (distributorMinimumRequiredValue > 0 && orderValueForDistributorMinimumCheck < distributorMinimumRequiredValue) {
        isDistributorMinimumMet = false;
        distributorPricesAppliedInCalc = false; 
      } else {
        isDistributorMinimumMet = true;
        distributorPricesAppliedInCalc = true; 
      }
    } else {
      isDistributorMinimumMet = true; 
      distributorPricesAppliedInCalc = false;
    }
    
    console.log(`[calculatePrice] Cliente: ${userId}, Es Distribuidor: ${!!(customer?.role === 'Distributor')}, Mínimo Requerido: ${distributorMinimumRequiredValue}, Valor Pedido (para check): ${orderValueForDistributorMinimumCheck}, Mínimo Cumplido: ${isDistributorMinimumMet}, Aplicar Precios Distribuidor (calc): ${distributorPricesAppliedInCalc}`);

    // Segunda pasada: Aplicar precios finales
    for (const pItem of resolvedItemsPass1) {
      const product = pItem.productData;
      let finalUnitPrice = product.price; 
      let itemIsPromotion = false;
      let itemIsDistributorPrice = false;

      console.log(`[calculatePrice] Procesando producto: ${product.name} (ID: ${product.id})`);
      console.log(`  Precio Normal: ${product.price}`);

      if (product.isPromotion && product.promotionPrice && product.promotionPrice < finalUnitPrice) {
        finalUnitPrice = product.promotionPrice;
        itemIsPromotion = true;
        console.log(`  Aplicada Promoción. Precio actual: ${finalUnitPrice}`);
      }

      console.log(`  Intentando aplicar precio distribuidor: distributorPricesAppliedInCalc=${distributorPricesAppliedInCalc}, product.distributorPrice=${product.distributorPrice}, finalUnitPrice (actual)=${finalUnitPrice}`);
      if (distributorPricesAppliedInCalc && product.distributorPrice !== null && typeof product.distributorPrice !== 'undefined' && parseFloat(product.distributorPrice) < parseFloat(finalUnitPrice)) {
        finalUnitPrice = parseFloat(product.distributorPrice);
        itemIsDistributorPrice = true;
        itemIsPromotion = false; 
        console.log(`  Aplicado Precio Distribuidor. Precio final: ${finalUnitPrice}`);
      } else {
        console.log(`  No se aplicó precio de distribuidor. Razones:`);
        if (!distributorPricesAppliedInCalc) console.log(`    - distributorPricesAppliedInCalc es false.`);
        if (product.distributorPrice === null || typeof product.distributorPrice === 'undefined') console.log(`    - product.distributorPrice no está definido.`);
        if (product.distributorPrice !== null && typeof product.distributorPrice !== 'undefined' && !(parseFloat(product.distributorPrice) < parseFloat(finalUnitPrice))) console.log(`    - product.distributorPrice (${product.distributorPrice}) no es menor que finalUnitPrice (${finalUnitPrice}).`);
      }
      
      const itemTotal = finalUnitPrice * pItem.quantity;
      subtotal += itemTotal;
      pricedItems.push({
        productId: pItem.productId,
        quantity: pItem.quantity,
        name: product.name,
        sku: product.sku,
        unitPrice: finalUnitPrice,
        itemTotal,
        isPromotion: itemIsPromotion,
        isDistributorPrice: itemIsDistributorPrice,
        originalPrice: product.price, 
      });
    }
    
    console.log("[calculatePrice] Priced Items para enviar:", JSON.stringify(pricedItems, null, 2));
    
    const calculatedSubtotal = pricedItems.reduce((acc, item) => acc + item.itemTotal, 0);
    const calculatedTaxes = calculatedSubtotal * 0.19; // IVA 19% sobre el subtotal calculado
    const calculatedTotal = calculatedSubtotal + calculatedTaxes;


    res.status(200).json({
      error: false,
      message: 'Precios calculados exitosamente.',
      data: {
        items: pricedItems,
        subtotal: calculatedSubtotal,
        taxes: calculatedTaxes,
        total: calculatedTotal,
        isDistributor: customer?.role === 'Distributor',
        distributorMinimumRequired: distributorMinimumRequiredValue,
        distributorOrderValueForCheck: orderValueForDistributorMinimumCheck,
        isDistributorMinimumMet,
        distributorPricesApplied: distributorPricesAppliedInCalc,
      },
    });

  } catch (error) {
    console.error('Error en calculatePrice:', error); 
    // Devolver la estructura por defecto también en caso de error interno
    const errorResponseData = {
      items: [],
      subtotal: 0,
      taxes: 0,
      total: 0,
      isDistributor: false,
      distributorMinimumRequired: 0,
      distributorOrderValueForCheck: 0,
      isDistributorMinimumMet: true,
      distributorPricesApplied: false,
    };
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al calcular precios.',
      details: error.message,
      data: errorResponseData // Enviar data por defecto para que el frontend no rompa
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

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts,
  calculateProductPrice,
  calculatePrice, 
};
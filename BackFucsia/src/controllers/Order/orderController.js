const { Op } = require('sequelize');
const { Order, OrderItem, Payment, Product, User, DiscountRule, StockMovement, Distributor, Category, conn } = require('../../data');
// Función para aplicar reglas de descuento
const applyDiscountRules = async (items, user) => {
  try {
    const now = new Date();
    const userType = user?.role === 'Distributor' ? 'distributors' : 'customers';
    
    console.log(`🔍 Aplicando descuentos para usuario: ${user?.role || 'sin rol'} -> tipo: ${userType}`);
    
    // Obtener todas las reglas de descuento activas
    const allDiscountRules = await DiscountRule.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { startDate: null },
          { startDate: { [Op.lte]: now } }
        ],
        [Op.or]: [
          { endDate: null },
          { endDate: { [Op.gte]: now } }
        ]
      },
      order: [['priority', 'DESC'], ['createdAt', 'DESC']]
    });

    // FILTRO MANUAL ADICIONAL (por si el WHERE de Sequelize no funciona bien)
    const discountRules = allDiscountRules.filter(rule => {
      return rule.applicableFor === 'all' || rule.applicableFor === userType;
    });

    console.log(`📋 Reglas obtenidas de BD (todas):`, allDiscountRules.map(r => ({
      name: r.name,
      applicableFor: r.applicableFor,
      discountType: r.discountType,
      discountValue: r.discountValue
    })));

    console.log(`✅ Reglas aplicables después del filtro:`, discountRules.map(r => ({
      name: r.name,
      applicableFor: r.applicableFor,
      discountType: r.discountType,
      discountValue: r.discountValue
    })));

    if (!discountRules || discountRules.length === 0) {
      console.log('❌ No hay reglas de descuento aplicables');
      return { totalDiscount: 0, appliedDiscounts: [] };
    }

   

    // Calcular totales del carrito
    const cartSubtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    let totalDiscount = 0;
    const appliedDiscounts = [];

     // Aplicar reglas de descuento
    for (const rule of discountRules) {
      let ruleApplies = false;
      let discountAmount = 0;

      console.log(`🔄 Evaluando regla: ${rule.name} (${rule.applicableFor})`);

      // Verificar condiciones de la regla
      switch (rule.conditionType) {
        case 'quantity':
          ruleApplies = totalQuantity >= (rule.minQuantity || 0) && 
                       (!rule.maxQuantity || totalQuantity <= rule.maxQuantity);
          console.log(`   Condición cantidad: ${totalQuantity} >= ${rule.minQuantity || 0} && ${totalQuantity} <= ${rule.maxQuantity || '∞'} = ${ruleApplies}`);
          break;
        case 'amount':
          ruleApplies = cartSubtotal >= (parseFloat(rule.minAmount) || 0) && 
                       (!rule.maxAmount || cartSubtotal <= parseFloat(rule.maxAmount));
          console.log(`   Condición monto: ${cartSubtotal} >= ${rule.minAmount || 0} && ${cartSubtotal} <= ${rule.maxAmount || '∞'} = ${ruleApplies}`);
          break;
        case 'both':
          const quantityOk = totalQuantity >= (rule.minQuantity || 0) && (!rule.maxQuantity || totalQuantity <= rule.maxQuantity);
          const amountOk = cartSubtotal >= (parseFloat(rule.minAmount) || 0) && (!rule.maxAmount || cartSubtotal <= parseFloat(rule.maxAmount));
          ruleApplies = quantityOk && amountOk;
          console.log(`   Condición ambas: cantidad=${quantityOk} && monto=${amountOk} = ${ruleApplies}`);
          break;
      }

      // Si aplica la regla, calcular descuento
      if (ruleApplies) {
        if (rule.discountType === 'percentage') {
          discountAmount = cartSubtotal * (parseFloat(rule.discountValue) / 100);
        } else if (rule.discountType === 'fixed_amount') {
          discountAmount = Math.min(parseFloat(rule.discountValue), cartSubtotal);
        }

        if (discountAmount > 0) {
          totalDiscount += discountAmount;
          appliedDiscounts.push({
            id: rule.id,
            name: rule.name,
            type: rule.discountType,
            value: rule.discountValue,
            amount: discountAmount
          });

          console.log(`✅ Descuento aplicado: ${rule.name} - ${formatPrice(discountAmount)}`);
        }
      } else {
        console.log(`❌ Regla ${rule.name} NO aplica - No cumple condiciones`);
      }
    }

    console.log(`💰 Total descuentos aplicados: ${formatPrice(totalDiscount)}`);
    console.log(`📝 Descuentos detallados:`, appliedDiscounts.map(d => `${d.name}: ${formatPrice(d.amount)}`));

    return { totalDiscount, appliedDiscounts };
  } catch (error) {
    console.error('Error aplicando reglas de descuento:', error);
    return { totalDiscount: 0, appliedDiscounts: [] };
  }
};

// Generar número de orden secuencial
const generateOrderNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const prefix = `${year}${month}${day}`;
  
  const lastOrder = await Order.findOne({
    where: {
      orderNumber: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['orderNumber', 'DESC']]
  });
  
  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.substring(8));
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${String(sequence).padStart(4, '0')}`;
};

// Crear nueva orden/venta
const createOrder = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
 const {
  userId,
  items,
  orderType,
  paymentMethod,
  paymentDetails = {},
  notes: originalNotes,
  shippingAddress,
  cashierId,
  pickupInfo,
  extraDiscountPercentage = 0

} = req.body;

    // Validaciones básicas
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Datos de orden inválidos'
      });
    }

    // Validación específica: Ventas online solo pueden usar Wompi
    if (orderType === 'online' && paymentMethod !== 'wompi') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Las compras online solo pueden pagarse con Wompi por seguridad'
      });
    }

   let customer;

if (userId === 'GENERIC_001') {
  customer = await User.findByPk('GENERIC_001');
  if (!customer) {
    await transaction.rollback();
    return res.status(404).json({ 
      error: true, 
      message: 'Usuario genérico no encontrado. Reinicie el servidor.' 
    });
  }
  // AMBAS formas para asegurar que se propague
  customer.isGeneric = true;
  customer.dataValues.isGeneric = true;
  console.log('👤 Usando cliente genérico para venta local');
} else {
  // Cliente real - buscar en la base de datos
  customer = await User.findByPk(userId, {
    include: [{ model: Distributor, as: 'distributor', required: false }]
  });
  
  if (!customer) {
    await transaction.rollback();
    return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
  }
}


    // AHORA SÍ puedes hacer los console.log
    console.log('📦 Items recibidos del frontend:', items);
   console.log('👤 Usuario:', { 
  role: customer?.role, 
  hasDistributor: !!customer?.distributor,
  minimumPurchase: customer?.distributor?.minimumPurchase,
  isGeneric: customer?.isGeneric || false
});

    // Generar número de orden
    const orderNumber = await generateOrderNumber();

    // Calcular totales y verificar stock
    let subtotal = 0;
    const processedOrderItems = []; // Para guardar los datos finales de OrderItem
    let orderValueForDistributorMinimumCheck = 0;

    // Primera pasada: Calcular precios y el valor total para la verificación del mínimo de distribuidor
    for (const cartItem of items) {
      const { productId, quantity } = cartItem;
      const product = await Product.findByPk(productId);

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ error: true, message: `Producto ${productId} no encontrado` });
      }
      if (product.stock < quantity) {
        await transaction.rollback();
        return res.status(400).json({ error: true, message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}` });
      }
       console.log(`🏷️ Producto ${product.name}:`, {
    precio_normal: product.price,
    precio_distribuidor: product.distributorPrice,
    precio_promocion: product.promotionPrice,
    es_promocion: product.isPromotion
  });

      let effectivePrice = product.price; // Precio normal como base
      let isPromotion = false;

      // Aplicar promoción si es mejor
      if (product.isPromotion && product.promotionPrice && parseFloat(product.promotionPrice) < effectivePrice) {
        effectivePrice = parseFloat(product.promotionPrice);
        isPromotion = true;
        console.log(`   🎯 Aplicando precio promoción: ${effectivePrice}`);
      }

      // Si es distribuidor, el precio para el chequeo del mínimo es el de distribuidor si es mejor
      if (customer.role === 'Distributor' && customer.distributor && product.distributorPrice) {
        const distributorPrice = parseFloat(product.distributorPrice);
        if (distributorPrice < effectivePrice) {
          orderValueForDistributorMinimumCheck += quantity * distributorPrice;
          console.log(`   💼 Precio distribuidor más bajo: ${distributorPrice} (para chequeo mínimo)`);
        } else {
          orderValueForDistributorMinimumCheck += quantity * effectivePrice;
          console.log(`   💼 Precio actual mejor que distribuidor: ${effectivePrice} (para chequeo mínimo)`);
        }
      } else {
        orderValueForDistributorMinimumCheck += quantity * effectivePrice;
        console.log(`   👤 Usuario normal o sin precio distribuidor (para chequeo mínimo)`);
      }
      
      processedOrderItems.push({
        productId,
        quantity,
        productData: product, // Para actualizar stock
        // Precios y flags se determinarán en la segunda pasada
        unitPrice: 0, 
        itemSubtotal: 0,
        isPromotionApplied: isPromotion, // Basado en la primera evaluación
        isDistributorPriceApplied: false,
        originalPrice: product.price // Guardar precio de lista
      });
    }

  let applyDistributorPrices = false;
let distributorMinimumRequiredValue = 0; // Para la respuesta
if (customer.role === 'Distributor' && customer.distributor && !customer.isGeneric) {
  distributorMinimumRequiredValue = parseFloat(customer.distributor.minimumPurchase) || 0;
  console.log(`💼 Chequeo distribuidor: valor pedido=${orderValueForDistributorMinimumCheck}, mínimo requerido=${distributorMinimumRequiredValue}`);
  
  // CORRECCIÓN: Si el mínimo es 0 o no está definido, siempre aplicar precios de distribuidor
  if (distributorMinimumRequiredValue <= 0 || orderValueForDistributorMinimumCheck >= distributorMinimumRequiredValue) {
    applyDistributorPrices = true;
    console.log(`✅ Aplicando precios de distribuidor - ${distributorMinimumRequiredValue <= 0 ? 'Sin mínimo requerido' : 'Mínimo cumplido'}`);
  } else {
    applyDistributorPrices = false;
    console.log(`❌ NO aplicando precios de distribuidor - Mínimo no cumplido (requiere: ${distributorMinimumRequiredValue}, actual: ${orderValueForDistributorMinimumCheck})`);
  }
}
    // Segunda pasada: Establecer precios finales y calcular subtotal
    for (const pItem of processedOrderItems) {
      let finalUnitPrice = pItem.originalPrice; // Empezar con precio normal
      console.log(`\n🔄 Procesando ${pItem.productData.name}:`);
      console.log(`   Precio base: ${finalUnitPrice}`);

      // Aplicar promoción si es mejor que el normal
      if (pItem.productData.isPromotion && pItem.productData.promotionPrice && parseFloat(pItem.productData.promotionPrice) < finalUnitPrice) {
        finalUnitPrice = parseFloat(pItem.productData.promotionPrice);
        pItem.isPromotionApplied = true; // Confirmar flag
        console.log(`   ✅ Aplicando promoción: ${finalUnitPrice}`);
      } else {
        pItem.isPromotionApplied = false; // No aplicó o no era mejor
        console.log(`   ❌ Sin promoción aplicable`);
      }

      // Si aplican precios de distribuidor y es mejor que el precio actual (normal o promo)
      if (applyDistributorPrices && pItem.productData.distributorPrice && parseFloat(pItem.productData.distributorPrice) < finalUnitPrice) {
        finalUnitPrice = parseFloat(pItem.productData.distributorPrice);
        pItem.isDistributorPriceApplied = true;
        pItem.isPromotionApplied = false; // Precio de distribuidor anula promo si es mejor
        console.log(`   ✅ Aplicando precio distribuidor: ${finalUnitPrice}`);
      } else if (applyDistributorPrices) {
        console.log(`   ❌ Precio distribuidor no es mejor: ${parseFloat(pItem.productData.distributorPrice || 0)} vs ${finalUnitPrice}`);
      }
      
      pItem.unitPrice = finalUnitPrice;
      pItem.itemSubtotal = pItem.quantity * pItem.unitPrice;
      subtotal += pItem.itemSubtotal;
      
      console.log(`   💰 Precio final: ${finalUnitPrice} x ${pItem.quantity} = ${pItem.itemSubtotal}`);
    }
    
    console.log(`\n🧮 Subtotal calculado: ${subtotal}`);

    // **APLICAR REGLAS DE DESCUENTO**
    const discountResult = await applyDiscountRules(processedOrderItems, customer);
    let rulesDiscount = discountResult.totalDiscount;
    const appliedDiscountRules = discountResult.appliedDiscounts;
    
    // Calcular descuentos totales
    let totalDiscount = rulesDiscount;
  
    let finalNotes = originalNotes || ''; // Variable para manejar las notas
    
   // Aplicar descuento extra del POS si existe
let extraDiscountAmount = 0;
if (orderType === 'local') {
  // Debug: mostrar lo que viene del frontend
  console.log('💰 Datos de descuento recibidos:', {
    extraDiscountPercentage,
    extraDiscountAmountFromBody: extraDiscountAmount,
    extraDiscountAmountFromPaymentDetails: paymentDetails.extraDiscountAmount,
    discountType: paymentDetails.extraDiscountType
  });

  if (extraDiscountPercentage > 0) {
    // Descuento por porcentaje
    extraDiscountAmount = subtotal * (parseFloat(extraDiscountPercentage) / 100);
    console.log(`Descuento POS por porcentaje: ${extraDiscountPercentage}% = ${formatPrice(extraDiscountAmount)}`);
  } else if (paymentDetails.extraDiscountAmount > 0) {
    // Descuento por monto fijo
    extraDiscountAmount = Math.min(parseFloat(paymentDetails.extraDiscountAmount), subtotal);
    console.log(`Descuento POS por monto fijo: ${formatPrice(extraDiscountAmount)}`);
  } else if (extraDiscountAmount > 0) {
    // Fallback: usar el valor del body directamente
    extraDiscountAmount = Math.min(parseFloat(extraDiscountAmount), subtotal);
    console.log(`Descuento POS por monto fijo (fallback): ${formatPrice(extraDiscountAmount)}`);
  }
  
  if (extraDiscountAmount > 0) {
    totalDiscount += extraDiscountAmount;
    
    const discountNote = paymentDetails.extraDiscountType === 'percentage' 
      ? `\nDescuento POS aplicado: ${extraDiscountPercentage}% (${formatPrice(extraDiscountAmount)})`
      : `\nDescuento POS aplicado: ${formatPrice(extraDiscountAmount)}`;
    finalNotes = finalNotes + discountNote;
  }
}

    // Agregar notas sobre reglas de descuento aplicadas
    if (appliedDiscountRules.length > 0) {
      const rulesNote = `\nDescuentos aplicados: ${appliedDiscountRules.map(r => `${r.name} (-${formatPrice(r.amount)})`).join(', ')}`;
      finalNotes = finalNotes + rulesNote;
    }
    if (customer.isGeneric) {
  finalNotes = finalNotes + '\n[Venta a Cliente Local - Sin registro]';
}
    
    const total = subtotal - totalDiscount;

    // Crear la orden con campos de descuento
    const order = await Order.create({
      orderNumber,
      userId: customer.isGeneric ? 'GENERIC_001' : userId,
      subtotal,
      discount: totalDiscount,
      tax: 0, // Calcular impuestos si es necesario
      total,
      status: 'pending', // Estado inicial
      orderType: orderType || 'local',
      paymentStatus: 'pending',
      cashierId: cashierId || null,
      notes: finalNotes, // Usar la variable finalNotes
      shippingAddress, // Para envíos
      pickupInfo: orderType === 'online' ? pickupInfo : null, // Para retiro en tienda
      appliedDiscounts: appliedDiscountRules // NUEVO CAMPO - Guardar descuentos aplicados como JSON
    }, { transaction });

    for (const pItem of processedOrderItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: pItem.productId,
        quantity: pItem.quantity,
        unitPrice: pItem.unitPrice,
        subtotal: pItem.itemSubtotal, // Este es quantity * unitPrice
        appliedDiscount: 0 // Para futuras reglas de descuento por item
      }, { transaction });

      // Actualizar stock
      await pItem.productData.update({
        stock: pItem.productData.stock - pItem.quantity
      }, { transaction });

      // Registrar movimiento de stock
      await StockMovement.create({
        productId: pItem.productId,
        quantity: -pItem.quantity,
        type: 'salida',
        reason: `Venta orden ${orderNumber}`,
        previousStock: pItem.productData.stock + pItem.quantity, // Stock antes de esta venta
        currentStock: pItem.productData.stock, // Stock después de esta venta (ya actualizado)
        userId: cashierId || userId,
        orderId: order.id
      }, { transaction });
    }

    // Crear pago si se especifica método
    if (paymentMethod) {
      const paymentAmount = paymentDetails.finalTotal || total;
      
      if (paymentMethod === 'combinado') {
        // CORREGIDO: Manejar pagos combinados creando múltiples registros para UNA SOLA ORDEN
        const combinedPayments = paymentDetails.combinedPayments || [];
        
        console.log('🔄 [Combined Payment] Procesando pago combinado para orden:', orderNumber);
        console.log('🔄 [Combined Payment] Métodos de pago:', combinedPayments);
        
        if (combinedPayments.length === 0) {
          await transaction.rollback();
          return res.status(400).json({
            error: true,
            message: 'Debe especificar al menos un método de pago para el pago combinado'
          });
        }
        
        // Validar que el total coincida
        const combinedTotal = combinedPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        if (Math.abs(combinedTotal - paymentAmount) > 0.01) {
          await transaction.rollback();
          return res.status(400).json({
            error: true,
            message: `El total de los pagos combinados (${formatPrice(combinedTotal)}) no coincide con el total de la orden (${formatPrice(paymentAmount)})`
          });
        }
        
        // CREAR MÚLTIPLES REGISTROS DE PAGO PARA LA MISMA ORDEN
        const createdPayments = [];
        for (const [index, payment] of combinedPayments.entries()) {
          if (payment.amount > 0) {
            console.log(`💳 [Combined Payment] Creando pago ${index + 1}: ${payment.method} - ${formatPrice(payment.amount)}`);
            
            const createdPayment = await Payment.create({
              orderId: order.id, // ✅ MISMO orderId para todos los pagos
              amount: parseFloat(payment.amount),
              method: payment.method,
              status: payment.method === 'credito' ? 'pending' : 'completed',
              paymentDetails: {
                ...paymentDetails,
                originalTotal: subtotal,
                rulesDiscount: rulesDiscount,
                appliedDiscountRules: appliedDiscountRules,
                extraDiscountPercentage: extraDiscountPercentage || 0,
                extraDiscountAmount: extraDiscountAmount,
                finalTotal: total,
                // ✅ IDENTIFICADORES DE PAGO COMBINADO
                isCombinedPayment: true,
                combinedPaymentMethod: payment.method,
                combinedPaymentIndex: index + 1,
                combinedPaymentTotal: combinedPayments.length,
                combinedPaymentNote: `Pago ${index + 1} de ${combinedPayments.length} (${payment.method})`
              },
              dueDate: payment.method === 'credito' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
              // ✅ TRANSACTION ID ÚNICO PARA CADA PAGO PERO RELACIONADO
              transactionId: `${orderNumber}-COMBINED-${index + 1}-${payment.method.toUpperCase()}`
            }, { transaction });
            
            createdPayments.push(createdPayment);
          }
        }
        
        console.log(`✅ [Combined Payment] Se crearon ${createdPayments.length} registros de pago para la orden ${orderNumber}`);
        
        // Actualizar estado de pago de la orden
        const hasCreditPayment = combinedPayments.some(p => p.method === 'credito' && p.amount > 0);
        const newPaymentStatus = hasCreditPayment ? 'partial' : 'completed';
        const newOrderStatus = hasCreditPayment ? 'confirmed' : 'completed';
        
        await order.update({
          paymentStatus: newPaymentStatus,
          status: newOrderStatus,
          // ✅ AGREGAR NOTA SOBRE PAGO COMBINADO
          notes: `${finalNotes}\n[PAGO COMBINADO: ${combinedPayments.length} métodos - ${combinedPayments.map(p => `${p.method}: ${formatPrice(p.amount)}`).join(', ')}]`
        }, { transaction });
        
        console.log(`✅ [Combined Payment] Orden ${orderNumber} actualizada - Estado: ${newOrderStatus}, Pago: ${newPaymentStatus}`);
        
      } else {
        // CÓDIGO EXISTENTE: Pago único
        console.log(`💳 [Single Payment] Creando pago único: ${paymentMethod} - ${formatPrice(paymentAmount)}`);
        
        await Payment.create({
          orderId: order.id,
          amount: paymentAmount,
          method: paymentMethod,
          status: paymentMethod === 'credito' ? 'pending' : 'completed',
          paymentDetails: {
            ...paymentDetails,
            originalTotal: subtotal,
            rulesDiscount: rulesDiscount,
            appliedDiscountRules: appliedDiscountRules,
            extraDiscountPercentage: extraDiscountPercentage || 0,
            extraDiscountAmount: extraDiscountAmount,
            finalTotal: total,
            isCombinedPayment: false
          },
          dueDate: paymentMethod === 'credito' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
          transactionId: `${orderNumber}-${paymentMethod.toUpperCase()}`
        }, { transaction });

        // ✅ CORRECCIÓN CRÍTICA: Actualizar estado de orden DESPUÉS de crear el pago
        let newPaymentStatus = 'pending';
        let newOrderStatus = 'pending';

        if (paymentMethod === 'credito') {
          newPaymentStatus = 'pending';
          newOrderStatus = 'confirmed'; // Confirmada pero pendiente de pago
        } else {
          // ✅ CORREGIR: Para cualquier otro método de pago (efectivo, tarjeta, etc.)
          newPaymentStatus = 'completed';
          newOrderStatus = 'completed'; // Orden completada
        }

        console.log(`💳 [Single Payment] Actualizando orden: paymentStatus=${newPaymentStatus}, orderStatus=${newOrderStatus}`);
        
        await order.update({
          paymentStatus: newPaymentStatus,
          status: newOrderStatus
        }, { transaction });

        console.log(`✅ [Single Payment] Orden ${orderNumber} actualizada exitosamente - Estado: ${newOrderStatus}, Pago: ${newPaymentStatus}`);
      }
    }

    await transaction.commit();

    // Obtener orden completa para respuesta
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        {
          model: Payment,
          as: 'payments'
        },
        {
          model: User,
          as: 'customer',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    let successMessage = 'Orden creada exitosamente';
if (customer.isGeneric) {
  successMessage = 'Venta local creada exitosamente (Cliente Local)';
} else if (customer.role === 'Distributor' && applyDistributorPrices) {
  successMessage = 'Orden de distribuidor creada exitosamente con precios especiales';
} else if (customer.role === 'Distributor' && !applyDistributorPrices && distributorMinimumRequiredValue > 0) {
  successMessage = 'Orden de distribuidor creada con precios normales/promoción (mínimo no alcanzado)';
}
    
   if (extraDiscountAmount > 0) {
  if (paymentDetails.extraDiscountType === 'percentage') {
    successMessage += ` - Descuento POS aplicado: ${extraDiscountPercentage}%`;
  } else {
    successMessage += ` - Descuento POS aplicado: ${formatPrice(extraDiscountAmount)}`;
  }
}

    if (appliedDiscountRules.length > 0) {
      successMessage += ` - Descuentos por reglas aplicados: ${formatPrice(rulesDiscount)}`;
    }

    res.status(201).json({
      error: false,
      message: successMessage,
      data: completeOrder
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear orden:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};


// Obtener órdenes del usuario actual (para clientes)
const getMyOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      orderType, 
      paymentStatus,
      startDate,
      endDate
    } = req.query;

    // El userId viene del token decodificado en el middleware
    const userId = req.user.id;

    const whereClause = { userId }; // Solo órdenes del usuario actual
    if (status) whereClause.status = status;
    if (orderType) whereClause.orderType = orderType;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        {
          model: Payment,
          as: 'payments'
        },
        {
          model: User,
          as: 'customer',
          attributes: { exclude: ['password'] }
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      error: false,
      message: 'Mis órdenes obtenidas exitosamente',
      data: {
        orders: orders.rows,
        totalOrders: orders.count,
        totalPages: Math.ceil(orders.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error al obtener mis órdenes:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todas las órdenes
const getOrders = async (req, res) => {
  try {
    // Verificar que el usuario tenga permisos para ver todas las órdenes
    if (req.user.role !== 'Owner' && req.user.role !== 'Admin' && req.user.role !== 'Cashier') {
      return res.status(403).json({
        error: true,
        message: 'No tienes permisos para ver todas las órdenes'
      });
    }

    // ✅ VERIFICAR que los parámetros se lean correctamente
    const { 
      page = 1, 
      limit = 10, 
      status, 
      orderType, 
      paymentStatus,
      startDate,
      endDate,
      userId 
    } = req.query;

    console.log('📋 [getOrders] Parámetros recibidos:', {
      page: parseInt(page),
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      status,
      orderType,
      paymentStatus,
      startDate,
      endDate,
      userId
    });

    const whereClause = {};
    if (status) whereClause.status = status;
    if (orderType) whereClause.orderType = orderType;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;
    if (userId) whereClause.userId = userId;
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }

    console.log('🔍 [getOrders] WHERE clause:', whereClause);

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        {
          model: Payment,
          as: 'payments' // ✅ ESTO DEBE TRAER TODOS LOS PAGOS DE LA ORDEN
        },
        {
          model: User,
          as: 'customer',
          attributes: { exclude: ['password'] }
        },
        {
          model: User,
          as: 'cashier',
          attributes: { exclude: ['password'] }
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
      distinct: true // ✅ IMPORTANTE para COUNT correcto
    });

    console.log('✅ [getOrders] Resultados:', {
      totalFound: orders.count,
      returnedInThisPage: orders.rows.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(orders.count / parseInt(limit))
    });

    // ✅ DEBUG: Log para verificar estructura de datos
    if (orders.rows.length > 0) {
      const firstOrder = orders.rows[0];
      console.log(`🔍 [DEBUG Orders] Primera orden:`, {
        orderNumber: firstOrder.orderNumber,
        total: firstOrder.total,
        paymentsCount: firstOrder.payments?.length || 0,
        payments: firstOrder.payments?.map(p => ({
          method: p.method,
          amount: p.amount,
          isCombined: p.paymentDetails?.isCombinedPayment || false
        })) || []
      });
    }

    res.json({
      error: false,
      message: 'Órdenes obtenidas exitosamente',
      data: {
        orders: orders.rows,
        totalOrders: orders.count,
        totalPages: Math.ceil(orders.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('❌ [getOrders] Error:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener orden por ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            { 
              model: Product, 
              as: 'product' 
            },
            {
              model: DiscountRule,
              as: 'discountRule'
            }
          ]
        },
        {
          model: Payment,
          as: 'payments'
        },
        {
          model: User,
          as: 'customer',
          attributes: { exclude: ['password'] }
        },
        {
          model: User,
          as: 'cashier',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada'
      });
    }

    res.json({
      error: false,
      message: 'Orden obtenida exitosamente',
      data: order
    });

  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar estado de orden
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    await order.update(updateData);

    res.json({
      error: false,
      message: 'Estado de orden actualizado exitosamente',
      data: order
    });

  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Cancelar orden
const cancelOrder = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada'
      });
    }

    if (order.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'La orden ya está cancelada'
      });
    }

    // Restaurar stock
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId);
      await product.update({
        stock: product.stock + item.quantity
      }, { transaction });

      // Registrar movimiento de stock
      await StockMovement.create({
        productId: item.productId,
        quantity: item.quantity,
        type: 'entrada',
        reason: `Cancelación de orden ${order.orderNumber}${reason ? ` - ${reason}` : ''}`,
        previousStock: product.stock,
        currentStock: product.stock + item.quantity,
        userId: req.user?.id || order.userId,
        orderId: order.id
      }, { transaction });
    }

    // Actualizar orden
    await order.update({
      status: 'cancelled',
      notes: `${order.notes || ''}\nCancelada: ${reason || 'Sin razón especificada'}`
    }, { transaction });

    await transaction.commit();

    res.json({
      error: false,
      message: 'Orden cancelada exitosamente',
      data: order
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al cancelar orden:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Helper para formatear precio en mensajes de error del backend
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Nueva función para calcular precios CORREGIDA
// Reemplazar completamente la función calculatePrice
const calculatePrice = async (req, res) => {
  try {
    const { items, userId } = req.body;

    console.log('🧮 [Calculator] Iniciando cálculo de precios');
    console.log('📦 [Calculator] Items recibidos:', items);
    console.log('👤 [Calculator] Usuario n_document:', userId);

    // Estructura de respuesta por defecto
    const defaultResponseData = {
      items: [],
      subtotal: 0,
      totalDiscount: 0,
      total: 0,
      isDistributor: false,
      distributorInfo: null,
      orderValueForDistributorCheck: 0,
      appliedDistributorPrices: false,
      appliedDiscounts: [],
      savings: 0
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(200).json({ 
        error: false,
        message: 'No se proporcionaron items para calcular.',
        data: defaultResponseData
      });
    }

    // ✅ BUSCAR USUARIO CON n_document
    const customer = userId ? await User.findOne({
      where: { n_document: userId },
      include: [{ model: Distributor, as: 'distributor', required: false }]
    }) : null;

    console.log('👤 [Calculator] Query resultado:', {
      customerFound: !!customer,
      nDocument: customer?.n_document,
      customerRole: customer?.role,
      hasDistributor: !!customer?.distributor,
      distributorData: customer?.distributor ? {
        id: customer.distributor.id,
        discountPercentage: customer.distributor.discountPercentage,
        minimumPurchase: customer.distributor.minimumPurchase
      } : null
    });

    // Primera pasada: Obtener productos y calcular valor para chequeo de mínimo
    let orderValueForDistributorCheck = 0;
    const itemsWithProducts = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        throw new Error(`Producto ${item.productId} no encontrado.`);
      }

      console.log(`📦 [Calculator] Producto encontrado: ${product.name}`);
      console.log(`   Precio normal: ${product.price}`);
      console.log(`   Precio distribuidor: ${product.distributorPrice || 'N/A'}`);
      console.log(`   Precio promoción: ${product.promotionPrice || 'N/A'}`);
      console.log(`   Es promoción: ${product.isPromotion}`);

      let priceForDistributorCheck = parseFloat(product.price);

      // Aplicar promoción si es mejor
      if (product.isPromotion && product.promotionPrice && parseFloat(product.promotionPrice) < priceForDistributorCheck) {
        priceForDistributorCheck = parseFloat(product.promotionPrice);
        console.log(`   Promoción aplicada para chequeo: ${priceForDistributorCheck}`);
      }

      // Si es distribuidor, usar precio de distribuidor para el chequeo si es mejor
      if (customer?.role === 'Distributor' && product.distributorPrice && parseFloat(product.distributorPrice) < priceForDistributorCheck) {
        priceForDistributorCheck = parseFloat(product.distributorPrice);
        console.log(`   Precio distribuidor aplicado para chequeo: ${priceForDistributorCheck}`);
      }

      orderValueForDistributorCheck += item.quantity * priceForDistributorCheck;

      itemsWithProducts.push({
        ...item,
        productData: product
      });
    }

    console.log(`💰 [Calculator] Valor total para chequeo distribuidor: ${orderValueForDistributorCheck}`);

    // Determinar si aplicar precios de distribuidor
    let applyDistributorPrices = false;
    let distributorMinimumRequired = 0;

    if (customer?.role === 'Distributor' && customer?.distributor) {
      distributorMinimumRequired = parseFloat(customer.distributor.minimumPurchase) || 0;
      
      console.log(`💼 [Calculator] Chequeo distribuidor: valor=${orderValueForDistributorCheck}, mínimo=${distributorMinimumRequired}`);
      
      if (distributorMinimumRequired <= 0 || orderValueForDistributorCheck >= distributorMinimumRequired) {
        applyDistributorPrices = true;
        console.log(`✅ [Calculator] Aplicando precios de distribuidor`);
      } else {
        console.log(`❌ [Calculator] No se aplican precios de distribuidor - Mínimo no cumplido`);
      }
    }

    // Segunda pasada: Aplicar precios finales
    const processedItems = [];
    let subtotal = 0;

    for (const pItem of itemsWithProducts) {
      const product = pItem.productData;
      let finalUnitPrice = parseFloat(product.price);
      let itemIsPromotion = false;
      let itemIsDistributorPrice = false;

      console.log(`🔄 [Calculator] Procesando ${product.name}:`);
      console.log(`   Precio base: ${finalUnitPrice}`);

      // Aplicar promoción si es mejor
      if (product.isPromotion && product.promotionPrice && parseFloat(product.promotionPrice) < finalUnitPrice) {
        finalUnitPrice = parseFloat(product.promotionPrice);
        itemIsPromotion = true;
        console.log(`   ✅ Aplicando promoción: ${finalUnitPrice}`);
      }

      // Aplicar precio distribuidor si corresponde y es mejor
      if (applyDistributorPrices && product.distributorPrice && parseFloat(product.distributorPrice) < finalUnitPrice) {
        finalUnitPrice = parseFloat(product.distributorPrice);
        itemIsDistributorPrice = true;
        itemIsPromotion = false; // Precio distribuidor anula promoción
        console.log(`   ✅ Aplicando precio distribuidor: ${finalUnitPrice}`);
      } else if (applyDistributorPrices) {
        console.log(`   ❌ Precio distribuidor no es mejor: ${parseFloat(product.distributorPrice || 0)} vs ${finalUnitPrice}`);
      }
      
      const itemTotal = finalUnitPrice * pItem.quantity;
      subtotal += itemTotal;

      processedItems.push({
        productId: pItem.productId,
        quantity: pItem.quantity,
        name: product.name,
        sku: product.sku,
        unitPrice: finalUnitPrice,
        itemTotal,
        isPromotion: itemIsPromotion,
        isDistributorPrice: itemIsDistributorPrice,
        originalPrice: parseFloat(product.price)
      });

      console.log(`   💰 Precio final: ${finalUnitPrice} x ${pItem.quantity} = ${itemTotal}`);
    }
    
    console.log(`🧮 [Calculator] Subtotal calculado: ${subtotal}`);

    // Aplicar reglas de descuento automáticas
    const discountResult = await applyDiscountRules(processedItems, customer);
    const totalDiscount = discountResult.totalDiscount;
    const appliedDiscounts = discountResult.appliedDiscounts;

    // Calcular total final
    const total = subtotal - totalDiscount;

    // Calcular ahorros (diferencia con precios originales)
    const originalTotal = processedItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const savings = originalTotal - total;

    console.log(`💰 [Calculator] Resumen final:`);
    console.log(`   Subtotal: ${subtotal}`);
    console.log(`   Descuento reglas: ${totalDiscount}`);
    console.log(`   Total: ${total}`);
    console.log(`   Ahorro total: ${savings}`);

    // Preparar respuesta
    const responseData = {
      items: processedItems,
      subtotal,
      totalDiscount,
      total,
      isDistributor: customer?.role === 'Distributor',
      distributorInfo: customer?.distributor ? {
        discountPercentage: customer.distributor.discountPercentage || 0,
        minimumPurchase: distributorMinimumRequired
      } : null,
      orderValueForDistributorCheck,
      appliedDistributorPrices: applyDistributorPrices,
      appliedDiscounts,
      savings: Math.max(0, savings)
    };

    console.log('📤 [Calculator] Enviando respuesta final:', responseData);

    res.status(200).json({
      error: false,
      message: 'Precios calculados exitosamente.',
      data: responseData
    });

  } catch (error) {
    console.error('❌ [Calculator] Error:', error);
    console.error('❌ [Calculator] Stack:', error.stack);
    
    const errorResponseData = {
      items: [],
      subtotal: 0,
      totalDiscount: 0,
      total: 0,
      isDistributor: false,
      distributorInfo: null,
      orderValueForDistributorCheck: 0,
      appliedDistributorPrices: false,
      appliedDiscounts: [],
      savings: 0
    };

    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al calcular precios.',
      details: error.message,
      data: errorResponseData
    });
  }
};

// ✅ NUEVA FUNCIÓN PARA OBTENER ÓRDENES QUE REQUIEREN FACTURACIÓN
const getOrdersRequiringBilling = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    // Filtros adicionales
    if (status) {
      whereClause.status = status;
    }
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              where: { isFacturable: true },
              include: [
                {
                  model: Category,
                  as: 'category'
                }
              ]
            }
          ]
        },
        {
          model: User,
          as: 'customer'
        },
        {
          model: User,
          as: 'cashier',
          attributes: ['n_document', 'first_name', 'last_name']
        },
        {
          model: Payment,
          as: 'payments' // ✅ ASEGURAR QUE SE INCLUYAN LOS PAGOS
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true // ✅ IMPORTANTE para COUNT correcto con JOINS
    });

    // ✅ DEBUG: Verificar que los pagos se estén incluyendo
    if (orders.length > 0) {
      console.log('🔍 [DEBUG Billing] Primera orden con pagos:', {
        orderNumber: orders[0].orderNumber,
        paymentsCount: orders[0].payments?.length || 0,
        paymentStatus: orders[0].paymentStatus,
        payments: orders[0].payments?.map(p => ({
          method: p.method,
          amount: p.amount,
          status: p.status
        })) || []
      });
    }

    // ✅ PROCESAR ÓRDENES PARA SEPARAR ITEMS FACTURABLES Y NO FACTURABLES
    const processedOrders = orders.map(order => {
      const orderData = order.toJSON();
      
      // Separar items facturables de no facturables
      const billableItems = orderData.items.filter(item => item.product.isFacturable);
      const nonBillableItems = orderData.items.filter(item => !item.product.isFacturable);
      
      // Calcular totales de facturación
      const billableSubtotal = billableItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
      const billableDiscount = billableItems.reduce((sum, item) => sum + parseFloat(item.appliedDiscount), 0);
      const billableTotal = billableSubtotal - billableDiscount;
      
      return {
        ...orderData,
        billableItems,
        nonBillableItems,
        billingInfo: {
          hasBillableItems: billableItems.length > 0,
          billableItemsCount: billableItems.length,
          nonBillableItemsCount: nonBillableItems.length,
          billableSubtotal,
          billableDiscount,
          billableTotal,
          requiresBilling: billableItems.length > 0
        }
      };
    });

    // ✅ FILTRAR SOLO ÓRDENES CON ITEMS FACTURABLES
    const ordersWithBillableItems = processedOrders.filter(order => order.billingInfo.hasBillableItems);

    res.json({
      error: false,
      message: 'Órdenes que requieren facturación obtenidas exitosamente',
      data: {
        orders: ordersWithBillableItems,
        totalOrders: ordersWithBillableItems.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(ordersWithBillableItems.length / limit),
        billingStats: {
          totalOrdersRequiringBilling: ordersWithBillableItems.length,
          totalBillableAmount: ordersWithBillableItems.reduce((sum, order) => sum + order.billingInfo.billableTotal, 0)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener órdenes que requieren facturación:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// ✅ FUNCIÓN CORREGIDA PARA MARCAR COMO FACTURADA
const markOrderAsBilled = async (req, res) => {
  try {
    // ✅ CAPTURAR CORRECTAMENTE EL ID DESDE LOS PARÁMETROS
    const { id } = req.params;  // ✅ CAMBIAR orderId POR id
    const { billingDetails } = req.body;

    console.log('🔖 [markOrderAsBilled] Parámetros recibidos:', { id, billingDetails });
    console.log('🔖 [markOrderAsBilled] req.params completo:', req.params);

    // Validar que el ID existe
    if (!id) {
      return res.status(400).json({
        error: true,
        message: 'ID de orden requerido'
      });
    }

    console.log('🔍 [markOrderAsBilled] Buscando orden con ID:', id);

    const order = await Order.findByPk(id);
    if (!order) {
      console.log('❌ [markOrderAsBilled] Orden no encontrada:', id);
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada'
      });
    }

    console.log('✅ [markOrderAsBilled] Orden encontrada:', order.orderNumber);

    // Crear información de facturación
    const currentDate = new Date().toISOString();
    const billingNote = `FACTURADA: ${currentDate}`;
    
    // Construir notas actualizadas
    const updatedNotes = order.notes ? `${order.notes} | ${billingNote}` : billingNote;

    // Actualizar la orden
    await order.update({
      notes: updatedNotes
    });

    console.log('✅ [markOrderAsBilled] Orden marcada como facturada exitosamente');

    res.json({
      error: false,
      message: 'Orden marcada como facturada exitosamente',
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        billedAt: currentDate,
        notes: updatedNotes
      }
    });

  } catch (error) {
    console.error('❌ [markOrderAsBilled] Error completo:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// ✅ FUNCIÓN TEMPORAL PARA CORREGIR INCONSISTENCIAS DE PAGO
const fixPaymentStatusInconsistencies = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    console.log('🔧 [FIX] Iniciando corrección de inconsistencias de estado de pago...');

    // Buscar todas las órdenes con pagos completados pero paymentStatus incorrecto
    const orders = await Order.findAll({
      include: [
        {
          model: Payment,
          as: 'payments'
        }
      ]
    });

    let correctedCount = 0;

    for (const order of orders) {
      if (!order.payments || order.payments.length === 0) continue;

      // Calcular el total pagado de pagos completados
      const totalPaid = order.payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

      const orderTotal = parseFloat(order.total);
      
      let correctPaymentStatus = 'pending';
      let correctOrderStatus = order.status;

      // Determinar el estado correcto
      if (totalPaid >= orderTotal) {
        correctPaymentStatus = 'completed';
        if (order.status === 'pending' || order.status === 'confirmed') {
          correctOrderStatus = 'completed';
        }
      } else if (totalPaid > 0) {
        correctPaymentStatus = 'partial';
        if (order.status === 'pending') {
          correctOrderStatus = 'confirmed';
        }
      }

      // Si hay inconsistencia, corregir
      if (order.paymentStatus !== correctPaymentStatus || order.status !== correctOrderStatus) {
        console.log(`🔧 [FIX] Corrigiendo orden ${order.orderNumber}:`);
        console.log(`   Estado anterior: paymentStatus=${order.paymentStatus}, status=${order.status}`);
        console.log(`   Estado nuevo: paymentStatus=${correctPaymentStatus}, status=${correctOrderStatus}`);
        console.log(`   Total pagado: ${totalPaid}, Total orden: ${orderTotal}`);

        await order.update({
          paymentStatus: correctPaymentStatus,
          status: correctOrderStatus
        }, { transaction });

        correctedCount++;
      }
    }

    await transaction.commit();

    res.json({
      error: false,
      message: `Corrección completada. ${correctedCount} órdenes corregidas.`,
      data: {
        correctedOrders: correctedCount,
        totalOrders: orders.length
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al corregir inconsistencias:', error);
    res.status(500).json({
      error: true,
      message: 'Error al corregir inconsistencias',
      details: error.message
    });
  }
};

// ✅ NUEVA FUNCIÓN PARA OBTENER ESTADÍSTICAS DE ÓRDENES
const getOrderStatistics = async (req, res) => {
  try {
    const { period = 'week' } = req.query; // 'day', 'week', 'month'
    
    // Calcular fechas según el período
    const now = new Date();
    let startDate;

    switch (period) {
      case 'day':
        // Desde las 00:00:00 de hoy hasta ahora
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        console.log(`📅 [Statistics] Calculando para HOY: ${startDate.toISOString()} - ${now.toISOString()}`);
        break;
      case 'week':
        // Últimos 7 días completos (incluyendo hoy)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6); // -6 para incluir hoy como día 7
        startDate.setHours(0, 0, 0, 0);
        console.log(`📅 [Statistics] Calculando para 7 DÍAS: ${startDate.toISOString()} - ${now.toISOString()}`);
        break;
      case 'month':
        // Desde el primer día del mes actual a las 00:00:00 hasta ahora
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        console.log(`📅 [Statistics] Calculando para MES: ${startDate.toISOString()} - ${now.toISOString()}`);
        break;
      default:
        startDate = new Date(0); // Desde el inicio
    }

    // ✅ CONSULTA CORRECTA: Obtener TODAS las órdenes del período (no paginadas)
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: now
        },
        status: {
          [Op.ne]: 'cancelled' // Excluir órdenes canceladas
        }
      },
      include: [
        {
          model: Payment,
          as: 'payments'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`📊 [Statistics] Órdenes encontradas para ${period}: ${orders.length}`);

    // Calcular estadísticas
    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // ✅ CALCULAR POR MÉTODO DE PAGO CORRECTAMENTE
    const byPaymentMethod = {
      wompi: { total: 0, orders: 0, percentage: 0 },
      nequi: { total: 0, orders: 0, percentage: 0 },
      bancolombia: { total: 0, orders: 0, percentage: 0 },
      efectivo: { total: 0, orders: 0, percentage: 0 },
      tarjeta: { total: 0, orders: 0, percentage: 0 },
      credito: { total: 0, orders: 0, percentage: 0 },
      daviplata: { total: 0, orders: 0, percentage: 0 },
      combinado: { total: 0, orders: 0, percentage: 0 }
    };

    // ✅ PROCESAR CADA ORDEN
    orders.forEach(order => {
      if (order.payments && order.payments.length > 0) {
        // Si tiene múltiples pagos, es combinado
        if (order.payments.length > 1) {
          byPaymentMethod.combinado.total += parseFloat(order.total || 0);
          byPaymentMethod.combinado.orders += 1;
        } else {
          // Pago único
          const payment = order.payments[0];
          const paymentMethod = payment.method;
          
          if (byPaymentMethod[paymentMethod]) {
            byPaymentMethod[paymentMethod].total += parseFloat(order.total || 0);
            byPaymentMethod[paymentMethod].orders += 1;
          }
        }
      }
    });

    // Calcular porcentajes
    Object.keys(byPaymentMethod).forEach(method => {
      if (totalSales > 0) {
        byPaymentMethod[method].percentage = (byPaymentMethod[method].total / totalSales) * 100;
      }
    });

    console.log(`💰 [Statistics] Estadísticas calculadas:`, {
      period,
      totalSales,
      totalOrders,
      averageOrderValue,
      byPaymentMethod: Object.entries(byPaymentMethod)
        .filter(([, data]) => data.total > 0)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    });

    res.json({
      error: false,
      message: 'Estadísticas calculadas exitosamente',
      data: {
        period,
        dateRange: {
          from: startDate.toISOString(),
          to: now.toISOString()
        },
        totalSales,
        totalOrders,
        averageOrderValue,
        byPaymentMethod
      }
    });

  } catch (error) {
    console.error('❌ [Statistics] Error:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  calculatePrice,
  getOrdersRequiringBilling,
  markOrderAsBilled,
  fixPaymentStatusInconsistencies,
  getOrderStatistics // ✅ FUNCIÓN DE ESTADÍSTICAS
};

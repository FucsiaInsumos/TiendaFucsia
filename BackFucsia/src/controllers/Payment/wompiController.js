const crypto = require('crypto');
const { 
  WOMPI_PRIVATE_KEY, 
  WOMPI_PUBLIC_KEY, 
  WOMPI_INTEGRITY_SECRET,
  WOMPI_EVENT_KEY 
} = require('../../config/envs');
const { Order, Payment, OrderItem, Product, User } = require('../../data');

// Generar token de aceptación de Wompi (modo desarrollo)
const generateAcceptanceToken = async (req, res) => {
  try {
    console.log('Generating acceptance token...');
    console.log('Public Key:', WOMPI_PUBLIC_KEY ? 'Set' : 'Not set');
    
    // Para desarrollo, devolver token mock
    const mockToken = {
      acceptance_token: `test_acceptance_token_${Date.now()}`,
      permalink: 'https://wompi.co/test-terms',
      public_key: WOMPI_PUBLIC_KEY || 'pub_test_mock_key'
    };
    
    res.json({
      error: false,
      message: 'Token de aceptación generado (desarrollo)',
      data: mockToken
    });
    
  } catch (error) {
    console.error('Error al obtener token de aceptación:', error);
    res.status(500).json({
      error: true,
      message: 'Error al obtener token de aceptación',
      details: error.message
    });
  }
};

// Crear transacción de pago
const createPaymentTransaction = async (req, res) => {
  try {
    const { 
      orderId, 
      amount_in_cents, 
      currency, 
      customer_email, 
      reference, 
      payment_method 
    } = req.body;

    console.log('Creating payment transaction:', {
      orderId,
      amount_in_cents,
      reference
    });

    // Para desarrollo, simular respuesta exitosa
    const mockResponse = {
      id: `test_transaction_${Date.now()}`,
      reference: reference,
      amount_in_cents: amount_in_cents,
      status: 'PENDING',
      payment_link_url: `https://checkout.wompi.co/l/${reference}`,
      created_at: new Date().toISOString()
    };

    // Crear registro de pago pendiente si tenemos orderId
    if (orderId) {
      await Payment.create({
        orderId,
        amount: amount_in_cents / 100,
        method: 'wompi',
        status: 'pending',
        transactionId: mockResponse.id,
        paymentDetails: {
          wompi_transaction_id: mockResponse.id,
          reference,
          payment_link: mockResponse.payment_link_url,
          mock: true
        }
      });
    }

    res.json({
      error: false,
      message: 'Transacción creada exitosamente (desarrollo)',
      data: mockResponse
    });

  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Utilidad para generar firma de Wompi (igual que en tu código existente)
const generarFirmaWompi = (transaction, properties, timestamp, secret) => {
  try {
    // Concatenar valores de propiedades especificadas
    const concatenatedProperties = properties.map(prop => {
      const value = transaction[prop];
      if (value === undefined || value === null) {
        throw new Error(`Property '${prop}' is missing in transaction data`);
      }
      return value.toString();
    }).join('');
    
    // Concatenar con timestamp y secret
    const stringToHash = concatenatedProperties + timestamp + secret;
    
    // Generar hash SHA256
    return crypto.createHash('sha256').update(stringToHash).digest('hex');
  } catch (error) {
    throw new Error(`Error generating signature: ${error.message}`);
  }
};

// Webhook para confirmación de pagos (adaptado de tu código existente)
const handleWebhook = async (req, res) => {
  try {
    console.log("----- Webhook Event Received -----");
    console.log("Headers:", req.headers);
    console.log("Parsed Body:", req.body);

    // 1. Obtener la firma del cuerpo
    const signature = req.body.signature;
    if (!signature || !signature.checksum || !signature.properties) {
      console.warn("Falta la firma en el cuerpo del evento.");
      return res.status(400).json({ error: 'Missing signature in event body' });
    }

    // 2. Obtener la clave secreta desde variables de entorno
    const secret = WOMPI_INTEGRITY_SECRET || WOMPI_EVENT_KEY;
    if (!secret) {
      console.error("WOMPI_INTEGRITY_SECRET/WOMPI_EVENT_KEY no está configurado.");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // 3. Extraer las propiedades especificadas para la firma
    const properties = signature.properties;
    const transaction = req.body.data.transaction;
    const timestamp = req.body.timestamp;

    console.log("Datos de la transacción recibida:", transaction);

    if (!transaction) {
      console.warn("Datos de transacción faltantes.");
      return res.status(400).json({ error: 'Missing transaction data' });
    }

    if (!timestamp) {
      console.warn("Timestamp faltante en el evento.");
      return res.status(400).json({ error: 'Missing timestamp in event data' });
    }

    // 4. Generar la firma calculada
    let calculatedHash;
    try {
      calculatedHash = generarFirmaWompi(transaction, properties, timestamp, secret);
    } catch (err) {
      console.warn("Error al generar la firma:", err.message);
      return res.status(400).json({ error: err.message });
    }

    console.log("Hash calculado:", calculatedHash);
    console.log("Firma recibida:", signature.checksum);

    // 5. Comparar el hash calculado con el hash recibido
    if (calculatedHash !== signature.checksum) {
      console.warn("Firma inválida. Hash calculado:", calculatedHash, "Firma recibida:", signature.checksum);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 6. Procesar el evento si la firma es válida
    const event = req.body.event;
    console.log("Tipo de evento:", event);
    console.log("Datos del evento:", req.body.data);

    if (event !== 'transaction.updated') {
      console.warn("Tipo de evento desconocido:", event);
      return res.status(400).json({ error: 'Unknown event type' });
    }

    // 7. Verificar los datos de la transacción
    const transactionData = req.body.data.transaction;
    if (!transactionData || !transactionData.reference) {
      console.warn("Datos de transacción inválidos:", transactionData);
      return res.status(400).json({ error: 'Invalid transaction data' });
    }

    console.log("Reference de la transacción:", transactionData.reference);

    // 8. Buscar el pago en la base de datos usando el reference
    // Primero intentamos buscar por transactionId (para transacciones reales)
    let payment = await Payment.findOne({
      where: { transactionId: transactionData.id },
      include: [{ 
        model: Order, 
        as: 'order',
        include: [
          { model: User, as: 'customer' },
          { 
            model: OrderItem, 
            as: 'items',
            include: [{ model: Product, as: 'product' }]
          }
        ]
      }]
    });

    // Si no encontramos por transactionId, buscamos por reference en la orden
    if (!payment) {
      const order = await Order.findOne({
        where: { orderNumber: transactionData.reference },
        include: [
          { model: Payment, as: 'payments' },
          { model: User, as: 'customer' },
          { 
            model: OrderItem, 
            as: 'items',
            include: [{ model: Product, as: 'product' }]
          }
        ]
      });

      if (order && order.payments && order.payments.length > 0) {
        payment = order.payments.find(p => p.method === 'wompi');
      }
    }

    if (!payment) {
      console.warn("Pago no encontrado para reference:", transactionData.reference);
      return res.status(404).json({ error: 'Payment not found' });
    }

    // 9. Actualizar el estado del pago y orden basado en el estado de la transacción
    let paymentStatus = 'pending';
    let orderStatus = payment.order.status;
    let orderPaymentStatus = payment.order.paymentStatus;

    switch (transactionData.status) {
      case 'APPROVED':
        paymentStatus = 'completed';
        orderPaymentStatus = 'completed';
        orderStatus = 'confirmed';
        console.log(`✅ Transacción APROBADA: ${transactionData.id}`);
        break;
      case 'DECLINED':
        paymentStatus = 'failed';
        orderPaymentStatus = 'failed';
        orderStatus = 'cancelled';
        console.log(`❌ Transacción RECHAZADA: ${transactionData.id}`);
        break;
      case 'PENDING':
        paymentStatus = 'pending';
        orderPaymentStatus = 'pending';
        orderStatus = 'pending';
        console.log(`⏳ Transacción PENDIENTE: ${transactionData.id}`);
        break;
      case 'VOIDED':
        paymentStatus = 'refunded';
        orderPaymentStatus = 'refunded';
        orderStatus = 'cancelled';
        console.log(`🔄 Transacción ANULADA: ${transactionData.id}`);
        break;
      default:
        console.warn(`Estado de transacción desconocido: ${transactionData.status}`);
        return res.status(400).json({ error: `Unknown transaction status: ${transactionData.status}` });
    }

    // 10. Actualizar el pago
    await payment.update({
      status: paymentStatus,
      transactionId: transactionData.id, // Actualizar con el ID real si era mock
      paymentDetails: {
        ...payment.paymentDetails,
        wompi_transaction_id: transactionData.id,
        wompi_status: transactionData.status,
        amount_in_cents: transactionData.amount_in_cents,
        currency: transactionData.currency,
        payment_method: transactionData.payment_method,
        updated_at: new Date()
      }
    });

    // 11. Actualizar la orden
    await payment.order.update({
      status: orderStatus,
      paymentStatus: orderPaymentStatus
    });

    console.log("✅ Orden actualizada exitosamente:", {
      orderId: payment.order.id,
      orderNumber: payment.order.orderNumber,
      newStatus: orderStatus,
      paymentStatus: orderPaymentStatus,
      transactionStatus: transactionData.status
    });

    return res.status(200).json({ 
      message: 'Payment and order updated successfully',
      orderId: payment.order.id,
      orderStatus: orderStatus,
      paymentStatus: paymentStatus
    });

  } catch (error) {
    console.error("❌ Error manejando el webhook:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Verificar estado de transacción
const checkTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Para desarrollo con mock
    if (transactionId.startsWith('test_transaction_')) {
      return res.json({
        error: false,
        message: 'Estado de transacción obtenido (desarrollo)',
        data: {
          id: transactionId,
          status: 'APPROVED',
          reference: `test_ref_${Date.now()}`,
          amount_in_cents: 100000,
          currency: 'COP'
        }
      });
    }

    // Para transacciones reales
    const payment = await Payment.findOne({
      where: { transactionId },
      include: [{ model: Order, as: 'order' }]
    });

    if (!payment) {
      return res.status(404).json({
        error: true,
        message: 'Transacción no encontrada'
      });
    }

    res.json({
      error: false,
      message: 'Estado de transacción obtenido',
      data: {
        id: transactionId,
        status: payment.status,
        order: {
          id: payment.order.id,
          orderNumber: payment.order.orderNumber,
          status: payment.order.status,
          total: payment.order.total
        }
      }
    });

  } catch (error) {
    console.error('Error al verificar transacción:', error);
    res.status(500).json({
      error: true,
      message: 'Error al verificar transacción'
    });
  }
};

module.exports = {
  generateAcceptanceToken,
  createPaymentTransaction,
  handleWebhook,
  checkTransactionStatus
};

const axios = require('axios');
const crypto = require('crypto');
const { Order, Payment, User } = require('../../data');
const { 
  WOMPI_PRIVATE_KEY, 
  WOMPI_PUBLIC_KEY, 
  WOMPI_INTEGRITY_SECRET,
  WOMPI_EVENT_KEY,
  getWompiApiUrl,
  FRONTEND_URL 
} = require('../../config/envs');

// ✅ LOGS DE VERIFICACIÓN (temporales)
console.log('🔑 Verificando credenciales Wompi:');
console.log('  Public Key:', WOMPI_PUBLIC_KEY ? `${WOMPI_PUBLIC_KEY.substring(0, 15)}...` : 'NO CONFIGURADA');
console.log('  Private Key:', WOMPI_PRIVATE_KEY ? `${WOMPI_PRIVATE_KEY.substring(0, 15)}...` : 'NO CONFIGURADA');
console.log('  API URL:', getWompiApiUrl());
console.log('  Integrity Secret:', WOMPI_INTEGRITY_SECRET ? 'CONFIGURADO' : 'NO CONFIGURADO');

// ✅ 1. GENERAR TOKEN DE ACEPTACIÓN (YA ACTUALIZADA)
const generateAcceptanceToken = async (req, res) => {
  try {
    console.log('🔑 [REAL] Obteniendo token de aceptación...');
    
    const apiUrl = getWompiApiUrl();
    const url = `${apiUrl}/merchants/${WOMPI_PUBLIC_KEY}`;
    
    console.log('📡 [REAL] Haciendo petición a:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ [REAL] Respuesta de Wompi:', response.status);

    const merchantData = response.data.data;
    const acceptanceToken = merchantData.presigned_acceptance.acceptance_token;
    
    res.json({
      error: false,
      message: 'Token de aceptación obtenido exitosamente (REAL)',
      data: {
        acceptance_token: acceptanceToken,
        permalink: merchantData.presigned_acceptance.permalink,
        public_key: WOMPI_PUBLIC_KEY,
        merchant_name: merchantData.name,
        is_real: true
      }
    });
    
  } catch (error) {
    console.error('❌ [REAL] Error obteniendo token:', error.message);
    console.error('❌ [REAL] Status:', error.response?.status);
    console.error('❌ [REAL] Data:', error.response?.data);
    
    res.status(500).json({
      error: true,
      message: 'Error al obtener token de aceptación real',
      details: error.response?.data || error.message,
      is_real: true
    });
  }
};

// ✅ 2. CREAR LINK DE PAGO (ACTUALIZAR ESTA)
const createPaymentLink = async (req, res) => {
  try {
    const { orderId, amount, description, customerEmail, customerName } = req.body;
    
    console.log('💳 [REAL] Creando link de pago:', {
      orderId,
      amount,
      customerEmail
    });

    // Validaciones
    if (!orderId || !amount || !customerEmail) {
      return res.status(400).json({
        error: true,
        message: 'Faltan datos requeridos: orderId, amount, customerEmail'
      });
    }

    const reference = `orden_${orderId}_${Date.now()}`;
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // ✅ PAYLOAD CORREGIDO - SIN IMAGE_URL PROBLEMÁTICA
    const apiUrl = getWompiApiUrl();
    const wompiPayload = {
      name: description || `Orden ${orderId}`,
      description: description || `Pago de orden ${orderId} - TiendaFucsia`,
      single_use: true,
      collect_shipping: false,
      currency: 'COP',
      amount_in_cents: amountInCents,
      reference: reference,
      // ✅ QUITAR O USAR UNA URL VÁLIDA
      // image_url: `${FRONTEND_URL}/logo.png`, // ← QUITAR ESTA LÍNEA
      redirect_url: `${FRONTEND_URL}/order-confirmation/${orderId}`,
      collect_customer_data: {
        email: true,
        name: true,
        phone_number: true,
        legal_identification: true
      }
    };

    console.log('📤 [REAL] Payload enviado a Wompi:', JSON.stringify(wompiPayload, null, 2));

    const response = await axios.post(`${apiUrl}/payment_links`, wompiPayload, {
      headers: {
        'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const paymentLinkData = response.data.data;

    // ✅ GUARDAR EN BASE DE DATOS
    await Payment.create({
      orderId,
      amount: parseFloat(amount),
      method: 'wompi',
      status: 'pending',
      transactionId: paymentLinkData.id,
      paymentDetails: {
        wompi_payment_link_id: paymentLinkData.id,
        reference: reference,
        amount_in_cents: amountInCents,
        currency: 'COP',
        permalink: paymentLinkData.permalink,
        created_at: paymentLinkData.created_at
      }
    });

    console.log('✅ [REAL] Link de pago creado:', paymentLinkData.permalink);

    res.json({
      error: false,
      message: 'Link de pago creado exitosamente',
      data: {
        id: paymentLinkData.id,
        reference: reference,
        payment_link_url: paymentLinkData.permalink,
        amount_in_cents: amountInCents,
        currency: 'COP',
        status: 'PENDING',
        is_real: true
      }
    });

  } catch (error) {
    console.error('❌ [REAL] Error creando link de pago:', error.message);
    console.error('❌ [REAL] Response:', error.response?.data);
    
    res.status(500).json({
      error: true,
      message: 'Error al crear link de pago',
      details: error.response?.data || error.message,
      is_real: true
    });
  }
};

// ✅ 3. CONSULTAR ESTADO DE TRANSACCIÓN
const getTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    console.log('🔍 [REAL] Consultando estado de transacción:', transactionId);

    const apiUrl = getWompiApiUrl();
    const response = await axios.get(`${apiUrl}/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const transactionData = response.data.data;

    // ✅ ACTUALIZAR EN BASE DE DATOS SI ES NECESARIO
    const payment = await Payment.findOne({
      where: { transactionId: transactionId }
    });

    if (payment && payment.status !== transactionData.status.toLowerCase()) {
      await payment.update({
        status: transactionData.status === 'APPROVED' ? 'completed' : 
                transactionData.status === 'DECLINED' ? 'failed' : 'pending',
        paymentDetails: {
          ...payment.paymentDetails,
          ...transactionData,
          updated_at: new Date()
        }
      });
    }

    res.json({
      error: false,
      message: 'Estado de transacción obtenido',
      data: transactionData
    });

  } catch (error) {
    console.error('❌ [REAL] Error consultando transacción:', error.message);
    
    res.status(500).json({
      error: true,
      message: 'Error al consultar estado de transacción',
      details: error.response?.data || error.message
    });
  }
};

// ✅ 4. WEBHOOK (MEJORAR EL EXISTENTE)
const handleWebhook = async (req, res) => {
  try {
    console.log("🔔 [REAL] Webhook recibido:", JSON.stringify(req.body, null, 2));

    const event = req.body;
    const signature = req.headers['x-wompi-signature'];
    const timestamp = req.headers['x-wompi-timestamp'];

    // ✅ VERIFICAR FIRMA
    if (WOMPI_INTEGRITY_SECRET && signature && timestamp) {
      const payload = `${timestamp}.${JSON.stringify(event)}`;
      const expectedSignature = crypto
        .createHmac('sha256', WOMPI_INTEGRITY_SECRET)
        .update(payload)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('❌ [REAL] Firma de webhook inválida');
        return res.status(401).json({ error: 'Firma inválida' });
      }
    }

    // ✅ PROCESAR EVENTO
    if (event.event === 'transaction.updated') {
      const transaction = event.data.transaction;
      
      console.log(`🔔 [REAL] Transacción actualizada: ${transaction.id} -> ${transaction.status}`);

      // Buscar payment por transactionId o reference
      const payment = await Payment.findOne({
        where: {
          [Op.or]: [
            { transactionId: transaction.id },
            { 'paymentDetails.reference': transaction.reference }
          ]
        }
      });

      if (payment) {
        const newStatus = transaction.status === 'APPROVED' ? 'completed' : 
                         transaction.status === 'DECLINED' ? 'failed' : 'pending';

        await payment.update({
          status: newStatus,
          paymentDetails: {
            ...payment.paymentDetails,
            ...transaction,
            webhook_received_at: new Date()
          }
        });

        // ✅ ACTUALIZAR ORDEN SI EL PAGO FUE APROBADO
        if (transaction.status === 'APPROVED' && payment.orderId) {
          await Order.update(
            { paymentStatus: 'paid', status: 'confirmed' },
            { where: { id: payment.orderId } }
          );
          
          console.log(`✅ [REAL] Orden ${payment.orderId} marcada como pagada`);
        }

        console.log(`✅ [REAL] Pago actualizado: ${payment.id} -> ${newStatus}`);
      } else {
        console.warn(`⚠️ [REAL] No se encontró payment para transacción: ${transaction.id}`);
      }
    }

    res.status(200).json({ message: 'Webhook procesado exitosamente' });

  } catch (error) {
    console.error("❌ [REAL] Error en webhook:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ 5. GENERAR SIGNATURE PARA WIDGET (NUEVO)
const generateWidgetSignature = async (req, res) => {
  try {
    const { reference, amount_in_cents, currency = 'COP' } = req.body;

    if (!reference || !amount_in_cents) {
      return res.status(400).json({
        error: true,
        message: 'reference y amount_in_cents son requeridos'
      });
    }

    // ✅ GENERAR SIGNATURE SEGÚN DOCUMENTACIÓN WOMPI
    const concatenatedString = `${reference}${amount_in_cents}${currency}${WOMPI_INTEGRITY_SECRET}`;
    const signature = crypto
      .createHash('sha256')
      .update(concatenatedString)
      .digest('hex');

    res.json({
      error: false,
      message: 'Signature generada exitosamente',
      data: {
        signature,
        reference,
        amount_in_cents,
        currency,
        public_key: WOMPI_PUBLIC_KEY
      }
    });

  } catch (error) {
    console.error('❌ Error generando signature:', error);
    res.status(500).json({
      error: true,
      message: 'Error al generar signature',
      details: error.message
    });
  }
};

// ✅ EXPORTAR TODAS LAS FUNCIONES
module.exports = {
  generateAcceptanceToken,
  createPaymentLink,
  getTransactionStatus,
  handleWebhook,
  generateWidgetSignature
};
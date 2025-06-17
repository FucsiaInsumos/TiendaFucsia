import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getAcceptanceToken, generateWompiSignature } from '../../Redux/Actions/wompiActions';
// ✅ QUITAR IMPORT DE CRYPTO-JS - Ya no lo necesitamos
// import sha256 from "crypto-js/sha256";

const WompiWidget = ({ 
  orderId,
  reference, 
  amount, 
  currency = 'COP', 
  customerEmail, 
  customerName, 
  customerDocument,
  customerPhone = '',
  onSuccess, 
  onError, 
  onClose 
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [widgetReady, setWidgetReady] = useState(false);

  // ✅ QUITAR DEBUG DE VARIABLES DE ENTORNO - Ya no las necesitamos hardcodeadas
  useEffect(() => {
    console.log('=== WOMPI WIDGET INICIALIZADO ===');
    console.log('Usando backend real para configuración');

    // Verificar si el widget está disponible
    const checkWidgetAvailability = () => {
      if (typeof window.WidgetCheckout !== 'undefined') {
        setWidgetReady(true);
        console.log('✅ WidgetCheckout está disponible');
      } else {
        console.log('❌ WidgetCheckout no está disponible');
        setTimeout(checkWidgetAvailability, 1000);
      }
    };

    checkWidgetAvailability();
  }, []);

  const handleWompiPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!widgetReady) {
        throw new Error('Widget de Wompi no está listo. Intenta de nuevo en unos segundos.');
      }

      // Validaciones básicas
      const amountInCents = Math.round(amount);
      if (amountInCents <= 0) {
        throw new Error('El monto a pagar debe ser positivo.');
      }

      if (!customerEmail || !/\S+@\S+\.\S+/.test(customerEmail)) {
        throw new Error('El email del cliente es inválido o está ausente.');
      }

      if (!reference || typeof reference !== 'string' || reference.trim() === '') {
        throw new Error('La referencia es inválida.');
      }

      console.log("=== INICIANDO PAGO REAL ===");
      console.log("Amount:", amountInCents);
      console.log("Reference:", reference);
      console.log("Email:", customerEmail);

      // ✅ 1. OBTENER TOKEN DE ACEPTACIÓN REAL DESDE BACKEND
      const tokenResponse = await dispatch(getAcceptanceToken());
      
      if (tokenResponse.error) {
        throw new Error(tokenResponse.message || 'Error obteniendo token de aceptación');
      }

      const acceptanceToken = tokenResponse.data.acceptance_token;
      const publicKey = tokenResponse.data.public_key;
      const merchantName = tokenResponse.data.merchant_name;

      console.log('✅ Token de aceptación obtenido:', acceptanceToken.substring(0, 20) + '...');
      console.log('✅ Public Key obtenido:', publicKey.substring(0, 15) + '...');
      console.log('✅ Merchant:', merchantName);

      // ✅ 2. GENERAR SIGNATURE REAL DESDE BACKEND
      const signatureResponse = await dispatch(generateWompiSignature(reference, amountInCents, currency));
      
      if (signatureResponse.error) {
        throw new Error(signatureResponse.message || 'Error generando signature');
      }

      const integrity = signatureResponse.data.signature;
      
      console.log('✅ Signature generada desde backend:', integrity.substring(0, 20) + '...');

      const redirectUrl = `${window.location.origin}/order-confirmation/${orderId || 'pending'}`;

      // ✅ 3. CONFIGURACIÓN CON DATOS REALES DEL BACKEND
      const checkoutData = {
        currency: currency,
        amountInCents: amountInCents,
        reference: reference,
        publicKey: publicKey, // ✅ Del backend
        redirectUrl: redirectUrl,
        acceptanceToken: acceptanceToken, // ✅ Del backend
        customerData: {
          email: customerEmail,
          fullName: customerName || 'Cliente TiendaFucsia',
          phoneNumber: customerPhone || '3001234567',
          phoneNumberPrefix: '+57',
          legalId: customerDocument || '',
          legalIdType: 'CC'
        },
        signature: {
          integrity: integrity, // ✅ Del backend
        }
      };

      console.log("=== CHECKOUT DATA REAL ===");
      console.log(JSON.stringify(checkoutData, null, 2));

      // ✅ 4. CREAR WIDGET CON CONFIGURACIÓN REAL
      let checkout;
      try {
        checkout = new window.WidgetCheckout(checkoutData);
      } catch (widgetError) {
        console.error('Error creando widget:', widgetError);
        throw new Error(`Error inicializando widget: ${widgetError.message}`);
      }

      // ✅ 5. ABRIR EL WIDGET
      checkout.open((result) => {
        const { transaction, error: widgetError } = result;
        setLoading(false);
        
        console.log("=== RESULTADO WIDGET REAL ===");
        console.log("Result:", result);
        
        if (transaction) {
          console.log('✅ Pago REAL exitoso:', transaction);
          toast.success('¡Pago completado exitosamente!');
          onSuccess(transaction);
        } else if (widgetError) {
          const errorMessage = widgetError.reason || widgetError.type || widgetError.message || 'Error en el pago';
          console.error('❌ Error en widget real:', widgetError);
          toast.error(`Error: ${errorMessage}`);
          onError({ reason: errorMessage });
        } else {
          console.log('Widget cerrado por el usuario');
          onClose();
        }
      });

    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.error('❌ Error fatal en pago real:', error);
      
      toast.error(`Error: ${error.message}`);
      onError({ reason: error.message });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price / 100);
  };

  // ✅ SIMPLIFICAR VALIDACIÓN - Ya no necesitamos variables de entorno frontend
  if (!widgetReady) {
    return (
      <div className="wompi-widget-container">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-900 mb-3">⏳ Cargando Sistema de Pagos</h4>
          <p className="text-yellow-800">Preparando el widget de Wompi...</p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wompi-widget-container">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-gray-900">💳 Pago Seguro con Wompi</h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Información del pago */}
        <div className="text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-900 mb-2">Detalles del Pago</h5>
          <p><strong>Referencia:</strong> {reference}</p>
          <p><strong>Monto:</strong> {formatPrice(amount)}</p>
          <p><strong>Cliente:</strong> {customerName}</p>
          <p><strong>Email:</strong> {customerEmail}</p>
          {customerDocument && <p><strong>Documento:</strong> {customerDocument}</p>}
          {customerPhone && <p><strong>Teléfono:</strong> +57 {customerPhone}</p>}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">❌ {error}</p>
          </div>
        )}
        
        {/* Botón principal de pago */}
        <div className="space-y-4">
          <button
            onClick={handleWompiPayment}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Conectando con Wompi...
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">💳</span>
                <span>Pagar {formatPrice(amount)} con Wompi Real</span>
              </div>
            )}
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
        
        {/* <div className="mt-6 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium text-blue-800 mb-1">🔒 Pago REAL procesado por Wompi</p>
          <p>• Acepta PSE, tarjetas de crédito/débito, Nequi y más</p>
          <p>• Transacción protegida con encriptación SSL</p>
          <p>• Configuración obtenida desde servidor seguro</p>
          <p className="text-green-600 font-medium mt-2">
            ✅ Usando credenciales reales del backend
          </p>
        </div> */}
      </div>
    </div>
  );
};

// ... PropTypes iguales
WompiWidget.propTypes = {
  orderId: PropTypes.string,
  reference: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string,
  customerEmail: PropTypes.string.isRequired,
  customerName: PropTypes.string,
  customerDocument: PropTypes.string,
  customerPhone: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WompiWidget;
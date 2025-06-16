import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import sha256 from "crypto-js/sha256";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [widgetReady, setWidgetReady] = useState(false);

  // Debug: Verificar variables de entorno al cargar el componente
  useEffect(() => {
    console.log('=== WOMPI DEBUG ===');
    console.log('VITE_WOMPI_PUBLIC_KEY:', import.meta.env.VITE_WOMPI_PUBLIC_KEY);
    console.log('VITE_WOMPI_INTEGRITY_SECRET:', import.meta.env.VITE_WOMPI_INTEGRITY_SECRET);
    console.log('VITE_FRONTEND_URL:', import.meta.env.VITE_FRONTEND_URL);
    console.log('==================');

    // Verificar si el widget está disponible
    const checkWidgetAvailability = () => {
      if (typeof window.WidgetCheckout !== 'undefined') {
        setWidgetReady(true);
        console.log('✅ WidgetCheckout está disponible');
      } else {
        console.log('❌ WidgetCheckout no está disponible');
        setTimeout(checkWidgetAvailability, 1000); // Reintentar en 1 segundo
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

      // Validaciones
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

      // Obtener configuración desde variables de entorno
      const publicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
      const integritySecret = import.meta.env.VITE_WOMPI_INTEGRITY_SECRET;
      
      // Validaciones críticas
      if (!publicKey || publicKey.length < 20) {
        throw new Error('❌ CRITICAL: Clave pública de Wompi inválida. Contacta al administrador.');
      }

      if (!integritySecret || integritySecret.length < 10) {
        throw new Error('❌ CRITICAL: Secret de integridad de Wompi inválido. Contacta al administrador.');
      }

      const redirectUrl = `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/order-confirmation/${orderId || 'pending'}`;
      
      console.log("=== CONFIGURACIÓN WOMPI ===");
      console.log("Public Key válida:", publicKey.substring(0, 15) + "...");
      console.log("Secret válido:", integritySecret ? 'Sí' : 'No');
      console.log("Amount:", amountInCents);
      console.log("Reference:", reference);
      console.log("Email:", customerEmail);

      // Calcular la firma de integridad
      const integrityString = `${reference}${amountInCents}${currency}${integritySecret}`;
      const integrity = sha256(integrityString).toString();
      
      console.log("Integrity string:", integrityString);
      console.log("Signature:", integrity);

      // Configuración MÍNIMA del checkout
      const checkoutData = {
        currency: currency,
        amountInCents: amountInCents,
        reference: reference,
        publicKey: publicKey,
        redirectUrl: redirectUrl,
        customerData: {
          email: customerEmail,
          fullName: customerName || 'Cliente TiendaFucsia',
          phoneNumber: customerPhone || '3001234567',
          phoneNumberPrefix: '+57',
          legalId: customerDocument || '',
          legalIdType: 'CC'
        },
        signature: {
          integrity: integrity,
        }
      };

      console.log("=== CHECKOUT DATA ===");
      console.log(JSON.stringify(checkoutData, null, 2));

      // Crear el widget con manejo de errores
      let checkout;
      try {
        checkout = new window.WidgetCheckout(checkoutData);
      } catch (widgetError) {
        console.error('Error creando widget:', widgetError);
        throw new Error(`Error inicializando widget: ${widgetError.message}`);
      }

      // Abrir el widget
      checkout.open((result) => {
        const { transaction, error: widgetError } = result;
        setLoading(false);
        
        console.log("=== RESULTADO WIDGET ===");
        console.log("Result:", result);
        
        if (transaction) {
          console.log('✅ Pago exitoso:', transaction);
          toast.success('¡Pago completado exitosamente!');
          onSuccess(transaction);
        } else if (widgetError) {
          const errorMessage = widgetError.reason || widgetError.type || widgetError.message || 'Error en el pago';
          console.error('❌ Error en widget:', widgetError);
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
      console.error('❌ Error fatal:', error);
      
      if (error.message.includes('CRITICAL')) {
        toast.error(`🚨 ${error.message}`);
      } else {
        toast.error(`Error: ${error.message}`);
      }
      
      onError({ reason: error.message });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price / 100);
  };

  // Si hay errores críticos de configuración
  const publicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
  const integritySecret = import.meta.env.VITE_WOMPI_INTEGRITY_SECRET;
  
  const hasConfigError = !publicKey || !integritySecret || 
                        publicKey.length < 20 || 
                        integritySecret.length < 10;

  if (hasConfigError) {
    return (
      <div className="wompi-widget-container">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="font-semibold text-red-900 mb-3">🚨 Error de Configuración</h4>
          <div className="text-red-800 space-y-2">
            <p><strong>El sistema de pagos no está configurado correctamente.</strong></p>
            <p>Detalles del problema:</p>
            <ul className="list-disc ml-5 space-y-1">
              {!publicKey && <li>Falta la clave pública de Wompi</li>}
              {!integritySecret && <li>Falta el secret de integridad</li>}
              {publicKey && publicKey.length < 20 && <li>Clave pública inválida</li>}
              {integritySecret && integritySecret.length < 10 && <li>Secret de integridad inválido</li>}
            </ul>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Para el administrador:</strong> Configurar las variables VITE_WOMPI_PUBLIC_KEY y VITE_WOMPI_INTEGRITY_SECRET en el archivo .env
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cerrar
          </button>
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

        {!widgetReady && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-600 text-sm">⏳ Cargando sistema de pagos...</p>
          </div>
        )}
        
        {/* Botón principal de pago */}
        <div className="space-y-4">
          <button
            onClick={handleWompiPayment}
            disabled={loading || !widgetReady}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition duration-200 ${
              loading || !widgetReady
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Procesando pago...
              </div>
            ) : !widgetReady ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Cargando...
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">💳</span>
                <span>Pagar {formatPrice(amount)}</span>
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
        
        <div className="mt-6 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium text-blue-800 mb-1">🔒 Pago seguro procesado por Wompi</p>
          <p>• Acepta PSE, tarjetas de crédito/débito, Nequi y más</p>
          <p>• Transacción protegida con encriptación SSL</p>
          <p>• Modalidad: Retiro en tienda</p>
          {publicKey && (
            <p className="text-orange-600 font-medium mt-2">
              🔑 Clave: {publicKey.substring(0, 15)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

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






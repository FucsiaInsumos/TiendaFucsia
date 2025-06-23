import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../Redux/Actions/salesActions';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';

const POSInterface = () => {
  const dispatch = useDispatch();
  
  // ✅ OBTENER USUARIO DEL ESTADO REDUX
  const { user } = useSelector(state => state.auth);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);

  // ✅ FUNCIÓN PARA CALCULAR TOTAL DEL CARRITO
  const calculateCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    // Aquí puedes agregar lógica de descuentos automáticos si es necesario
    return {
      subtotal,
      discount: 0, // Descuentos automáticos aplicados
      total: subtotal
    };
  };

  // ✅ FUNCIÓN PARA LIMPIAR CARRITO
  const clearCart = () => {
    setCart([]);
  };

  const handlePaymentComplete = async (paymentData) => {
    try {
      setProcessingPayment(true);
      
      const orderData = {
        userId: selectedCustomer?.id || 'GENERIC_001',
        items: cart,
        orderType: 'local',
        paymentMethod: paymentData.method,
        paymentDetails: paymentData.details,
        notes: paymentData.notes,
        cashierId: user?.id, // ✅ AHORA user ESTÁ DEFINIDO
        extraDiscountPercentage: paymentData.extraDiscountPercentage || 0
      };

      console.log('📤 Enviando datos de orden:', orderData);
      const response = await dispatch(createOrder(orderData));
      
      if (response.error === false) {
        // Mostrar el recibo
        setCompletedOrder(response.data);
        setShowReceiptModal(true);
        
        // Limpiar el carrito
        clearCart();
        setSelectedCustomer(null);
        setShowPaymentModal(false);
        
        alert('✅ ' + response.message);
      } else {
        alert('❌ Error: ' + response.message);
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('❌ Error al procesar el pago: ' + error.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Aquí va el contenido principal del POS */}
      
      {/* Modal de pago */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderTotal={calculateCartTotal()} // ✅ CALCULAR TOTAL DEL CARRITO
        onPaymentComplete={handlePaymentComplete}
        loading={processingPayment}
        selectedCustomer={selectedCustomer}
      />
      
      {/* Modal de recibo */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        order={completedOrder}
      />
    </div>
  );
};

export default POSInterface;
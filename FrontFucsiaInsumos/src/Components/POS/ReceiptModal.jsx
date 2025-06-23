import React from 'react';
import Receipt from './Receipt';
import { useReceipt } from '../../hooks/useReceipt';

const ReceiptModal = ({ isOpen, onClose, order }) => {
  const { printReceipt, downloadReceiptPDF } = useReceipt();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    printReceipt();
  };

  const handleDownload = () => {
    downloadReceiptPDF(order.orderNumber);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">🧾 Recibo de Venta</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-150"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Receipt 
          order={order} 
          onPrint={handlePrint}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

export default ReceiptModal;

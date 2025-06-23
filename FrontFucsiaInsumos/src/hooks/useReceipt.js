import { useCallback } from 'react';

export const useReceipt = () => {
  const printReceipt = useCallback(() => {
    const printWindow = window.open('', '_blank');
    const receiptElement = document.getElementById('receipt');
    
    if (receiptElement && printWindow) {
      // Obtener estilos CSS actuales
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Recibo de Venta - ${new Date().toLocaleDateString()}</title>
            <meta charset="utf-8">
            <style>
              ${styles}
              
              /* Estilos adicionales para impresión térmica */
              @page {
                size: 80mm auto;
                margin: 0;
              }
              
              body {
                margin: 0;
                padding: 0;
                font-family: 'Courier New', Courier, monospace;
                font-size: 11px;
                line-height: 1.2;
              }
              
              .no-print {
                display: none !important;
              }
              
              #receipt {
                max-width: 80mm;
                margin: 0 auto;
                padding: 5mm;
              }
              
              /* Asegurar que las imágenes se carguen */
              img {
                max-width: 40px;
                max-height: 40px;
              }
            </style>
          </head>
          <body>
            ${receiptElement.innerHTML}
            <script>
              // Esperar a que las imágenes se carguen antes de imprimir
              window.addEventListener('load', function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              });
              
              // Fallback si no hay imágenes
              if (document.images.length === 0) {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 250);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, []);

  const downloadReceiptPDF = useCallback(async (orderNumber) => {
    try {
      const receiptElement = document.getElementById('receipt');
      
      if (receiptElement) {
        // Crear una ventana nueva optimizada para PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Recibo ${orderNumber} - PDF</title>
              <meta charset="utf-8">
              <style>
                body { 
                  font-family: 'Courier New', Courier, monospace; 
                  margin: 20px; 
                  font-size: 12px;
                  max-width: 400px;
                }
                .no-print { display: none !important; }
                img { max-width: 60px; max-height: 60px; }
                @media print {
                  body { margin: 0; }
                }
              </style>
            </head>
            <body>
              ${receiptElement.innerHTML}
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 1000);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Use la opción de imprimir.');
    }
  }, []);

  return {
    printReceipt,
    downloadReceiptPDF
  };
};

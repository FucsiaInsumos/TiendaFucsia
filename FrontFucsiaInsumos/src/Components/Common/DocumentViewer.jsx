import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, Image, AlertCircle } from 'lucide-react';

const DocumentViewer = ({ isOpen, onClose, documentUrl, title = "Documento", fileType = null }) => {
  const [loadError, setLoadError] = useState(false);

  if (!isOpen) return null;

  console.log('=== DOCUMENT VIEWER DEBUG ===');
  console.log('Document URL:', documentUrl);
  console.log('Title:', title);
  console.log('File Type passed:', fileType);

  // Detectar tipo de archivo - MEJORADO para manejar URLs de Cloudinary raw
  const isPDF = fileType === 'pdf' || 
               documentUrl?.includes('.pdf') || 
               documentUrl?.toLowerCase().includes('pdf') ||
               documentUrl?.includes('/raw/upload/'); // URLs de Cloudinary raw son típicamente PDFs
  
  const isImage = !isPDF && documentUrl && (
    fileType === 'image' ||
    documentUrl.includes('.jpg') || 
    documentUrl.includes('.jpeg') || 
    documentUrl.includes('.png') || 
    documentUrl.includes('.gif') ||
    documentUrl.includes('.webp') ||
    documentUrl.includes('/image/upload/')
  );

  console.log('Is PDF:', isPDF);
  console.log('Is Image:', isImage);
  console.log('============================');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = `${title.replace(/\s+/g, '_')}.${isPDF ? 'pdf' : 'jpg'}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    console.log('Opening URL in new tab:', documentUrl);
    window.open(documentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              {isPDF ? (
                <FileText className="h-5 w-5 text-red-600 mr-2" />
              ) : (
                <Image className="h-5 w-5 text-blue-600 mr-2" />
              )}
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="flex items-center px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                title="Descargar"
              >
                <Download className="h-4 w-4 mr-1" />
                Descargar
              </button>
              <button
                onClick={handleOpenInNewTab}
                className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                title="Abrir en nueva pestaña"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Nueva pestaña
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content - IGUAL QUE EN TU CÓDIGO EXITOSO */}
          <div className="flex-1 overflow-hidden">
            {loadError ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <AlertCircle className="h-12 w-12 mb-4" />
                <h4 className="text-lg font-medium mb-2">No se pudo cargar el documento</h4>
                <p className="text-sm text-center mb-4">
                  El documento no se puede mostrar en el navegador.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar archivo
                  </button>
                  <button
                    onClick={handleOpenInNewTab}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir en nueva pestaña
                  </button>
                </div>
              </div>
            ) : isPDF ? (
              // USAR EXACTAMENTE EL MISMO IFRAME QUE EN TU CÓDIGO EXITOSO
              <div className="h-96 md:h-[600px]">
                <iframe
                  key={documentUrl}
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(documentUrl)}&embedded=true`}
                  title={title}
                  width="100%"
                  height="100%"
                  className="rounded-lg border"
                  allow="autoplay"
                  onError={() => setLoadError(true)}
                >
                  <p className="p-4 text-center text-gray-600">
                    No se pudo cargar la vista previa del PDF. Intenta abrirlo en una nueva pestaña.
                  </p>
                </iframe>
              </div>
            ) : isImage ? (
              <div className="p-4 flex items-center justify-center bg-gray-50">
                <img
                  src={documentUrl}
                  alt={title}
                  className="max-w-full max-h-96 object-contain rounded shadow"
                  onError={() => setLoadError(true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <FileText className="h-12 w-12 mb-4" />
                <h4 className="text-lg font-medium mb-2">Tipo de archivo no compatible</h4>
                <p className="text-sm text-center mb-4">
                  Este tipo de archivo no se puede visualizar directamente.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar archivo
                  </button>
                  <button
                    onClick={handleOpenInNewTab}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir en nueva pestaña
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 text-sm text-gray-600">
            {isPDF ? (
              <p>📋 <strong>Documento PDF:</strong> Si no se muestra correctamente, usa "Descargar" o "Nueva pestaña".</p>
            ) : (
              <p>💡 Si tienes problemas para ver el documento, puedes descargarlo o abrirlo en una nueva pestaña.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;

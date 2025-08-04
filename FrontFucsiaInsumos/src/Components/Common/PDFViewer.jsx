import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';

const PDFViewer = ({ pdfUrl, title, onDownload, onOpenNewTab }) => {
  const [viewMethod, setViewMethod] = useState('google'); // Cambiar default a google
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const viewMethods = [
    { key: 'iframe', label: 'Vista integrada', description: 'Mostrar en el modal' },
    { key: 'embed', label: 'Vista embed', description: 'Método alternativo' },
    { key: 'google', label: 'Google Docs Viewer', description: 'A través de Google' },
    { key: 'download', label: 'Solo descarga', description: 'Descargar directamente' }
  ];

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Reset después de cambiar método
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [viewMethod, pdfUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const renderPDFContent = () => {
    if (viewMethod === 'download') {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-gray-50">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Descarga requerida</h4>
            <p className="text-sm text-gray-600 mb-6">
              Este PDF debe descargarse para visualizarse correctamente.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={onDownload}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </button>
              <button
                onClick={onOpenNewTab}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir en nueva pestaña
              </button>
            </div>
          </div>
        </div>
      );
    }

    let src = pdfUrl;
    
    if (viewMethod === 'google') {
      src = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
    }

    const commonProps = {
      title: title,
      onLoad: handleIframeLoad,
      onError: handleIframeError,
      className: "w-full h-full border border-gray-300"
    };

    return (
      <div className="relative h-96 md:h-[600px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Cargando PDF...</p>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="text-center p-4">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-red-600 mb-3">Error al cargar con este método</p>
              <button
                onClick={() => {
                  const nextMethodIndex = (viewMethods.findIndex(m => m.key === viewMethod) + 1) % viewMethods.length;
                  setViewMethod(viewMethods[nextMethodIndex].key);
                }}
                className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
              >
                Probar otro método
              </button>
            </div>
          </div>
        )}

        {viewMethod === 'iframe' && (
          <iframe
            src={`${src}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
            {...commonProps}
          />
        )}

        {viewMethod === 'embed' && (
          <embed
            src={src}
            type="application/pdf"
            {...commonProps}
          />
        )}

        {viewMethod === 'google' && (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
            {...commonProps}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Selector de método de visualización */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Método de visualización:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {viewMethods.map((method) => (
                <button
                  key={method.key}
                  onClick={() => setViewMethod(method.key)}
                  className={`text-xs p-2 rounded border ${
                    viewMethod === method.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'
                  }`}
                >
                  <div className="font-medium">{method.label}</div>
                  <div className="text-xs opacity-75">{method.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del PDF */}
      {renderPDFContent()}

      {/* Botones de acción siempre visibles */}
      <div className="flex justify-center space-x-3 pt-2 border-t">
        <button
          onClick={onDownload}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar PDF
        </button>
        <button
          onClick={onOpenNewTab}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Nueva pestaña
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;

// Opcional: utils/cloudinaryUploader.js
const { cloudinary } = require('./cloudinaryConfig'); // Asumiendo que ya lo tienes
const fs = require('fs');

const uploadToCloudinary = (filePath, folder = 'work_images') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { folder: folder }, (error, result) => {
      if (error) {
        // Eliminar archivo local si la subida falla y fue un archivo temporal
        fs.unlinkSync(filePath); // Asegúrate de que filePath sea el correcto
        return reject(error);
      }
      // Eliminar archivo local después de la subida exitosa
      fs.unlinkSync(filePath);
      resolve({ secure_url: result.secure_url, public_id: result.public_id });
    });
  });
};

const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    // Usar la misma lógica que funciona en tu otro proyecto
    const isPDF = options.mimetype === 'application/pdf';
    
    // Configuración específica para PDFs (igual que tu código que funciona)
    const uploadOptions = {
      folder: options.folder || 'expenses',
      resource_type: isPDF ? 'raw' : 'auto',
      format: isPDF ? undefined : 'jpg',
      access_mode: 'public',
      public_id: options.public_id,
      ...options
    };
    
    console.log('Uploading to Cloudinary with options:', uploadOptions);
    console.log('File type detected (mimetype):', options.mimetype);
    console.log('Is PDF:', isPDF);
    
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('Error en upload_stream callback:', error);
        return reject(error);
      }
      if (!result) {
        console.error('Callback de Cloudinary no devolvió resultado.');
        return reject(new Error("Cloudinary did not return a result."));
      }
      
      console.log('Cloudinary upload successful:', {
        secure_url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format
      });
      
      // Devolver el objeto 'result' completo
      resolve(result); 
    });
    
    // Manejar errores del stream
    uploadStream.on('error', (streamError) => {
        console.error('Error en el stream de subida de Cloudinary:', streamError);
        reject(streamError);
    });
    
    uploadStream.end(buffer);
  });
};

const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = { uploadToCloudinary, deleteFromCloudinary, uploadBufferToCloudinary };
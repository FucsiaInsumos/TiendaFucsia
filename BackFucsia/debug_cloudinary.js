// Script de prueba para debuggear Cloudinary
const { cloudinary } = require('./src/utils/cloudinaryConfig');

console.log('=== DIAGNÓSTICO CLOUDINARY ===');
console.log('Configuración actual:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Configurado' : 'NO CONFIGURADO');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Configurado' : 'NO CONFIGURADO');

// Listar algunos archivos recientes de la carpeta expenses
cloudinary.api.resources({
  type: 'upload',
  prefix: 'expenses/',
  max_results: 10
}, (error, result) => {
  if (error) {
    console.error('Error al listar recursos:', error);
  } else {
    console.log('\n=== ARCHIVOS EN CLOUDINARY (expenses/) ===');
    result.resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.public_id}`);
      console.log(`   URL: ${resource.secure_url}`);
      console.log(`   Tipo: ${resource.resource_type}`);
      console.log(`   Formato: ${resource.format}`);
      console.log(`   Tamaño: ${resource.bytes} bytes`);
      console.log('   ---');
    });
  }
});

// Listar archivos raw (PDFs)
cloudinary.api.resources({
  type: 'upload',
  resource_type: 'raw',
  prefix: 'expenses/',
  max_results: 10
}, (error, result) => {
  if (error) {
    console.error('Error al listar recursos RAW:', error);
  } else {
    console.log('\n=== ARCHIVOS RAW EN CLOUDINARY (PDFs) ===');
    if (result.resources.length === 0) {
      console.log('No hay archivos RAW (PDFs) en la carpeta expenses/');
    } else {
      result.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.public_id}`);
        console.log(`   URL: ${resource.secure_url}`);
        console.log(`   Formato: ${resource.format}`);
        console.log(`   Tamaño: ${resource.bytes} bytes`);
        console.log('   ---');
      });
    }
  }
});

console.log('\n=== PRUEBA DE URL ===');
console.log('Si tienes una URL de comprobante, pruébala aquí:');

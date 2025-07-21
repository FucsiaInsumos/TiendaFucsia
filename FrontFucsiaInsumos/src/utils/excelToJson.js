const XLSX = require('xlsx');
const fs = require('fs');

function excelToJson(excelFilePath, outputJsonPath) {
    // Leer el archivo Excel
    const workbook = XLSX.readFile(excelFilePath);
    
    // Obtener la primera hoja
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Guardar como JSON
    fs.writeFileSync(outputJsonPath, JSON.stringify(jsonData, null, 2));
    
    console.log(`Archivo convertido: ${outputJsonPath}`);
    return jsonData;
}

// Uso
// Uso - actualizado con la ruta correcta
// Busca archivos .xlsx en la carpeta especificada
const baseDir = 'C:\Users\merce\Escritorio\ProductosSinPestaña';

// Función para encontrar archivos Excel en la carpeta
function findExcelFiles(directory) {
    try {
        if (!fs.existsSync(directory)) {
            console.log(`❌ La carpeta no existe: ${directory}`);
            return [];
        }
        
        const files = fs.readdirSync(directory);
        const excelFiles = files.filter(file => 
            file.toLowerCase().endsWith('.xlsx') || file.toLowerCase().endsWith('.xls')
        );
        
        console.log(`📁 Archivos Excel encontrados: ${excelFiles.join(', ')}`);
        return excelFiles.map(file => path.join(directory, file));
    } catch (error) {
        console.error('Error buscando archivos:', error.message);
        return [];
    }
}

// Ejecutar el script
console.log('🔍 Buscando archivos Excel...');
const excelFiles = findExcelFiles(baseDir);

if (excelFiles.length === 0) {
    console.log('❌ No se encontraron archivos Excel en la carpeta especificada.');
    console.log(`📁 Carpeta buscada: ${baseDir}`);
    console.log('💡 Asegúrate de que:');
    console.log('   1. La carpeta existe');
    console.log('   2. Contiene archivos .xlsx o .xls');
} else {
    // Usar el primer archivo Excel encontrado
    const excelFile = excelFiles[0];
    const outputFile = './productos.json';
    
    console.log(`📊 Procesando: ${path.basename(excelFile)}`);
    
    try {
        const productos = excelToJson(excelFile, outputFile);
        console.log(`
✅ ¡Conversión completada!`);
        console.log(`📁 Archivo JSON generado: ${outputFile}`);
        console.log(`📊 Total de productos: ${productos.length}`);
    } catch (error) {
        console.error('❌ Error en la conversión:', error.message);
    }
}
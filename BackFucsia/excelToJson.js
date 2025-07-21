const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function excelToJson(excelFilePath, outputJsonPath) {
    try {
        // Verificar si el archivo Excel existe
        if (!fs.existsSync(excelFilePath)) {
            throw new Error(`El archivo Excel no existe: ${excelFilePath}`);
        }

        console.log(`Leyendo archivo Excel: ${excelFilePath}`);
        
        // Leer el archivo Excel
        const workbook = XLSX.readFile(excelFilePath);
        
        console.log(`Hojas disponibles: ${workbook.SheetNames.join(', ')}`);
        
        // Obtener la primera hoja
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        console.log(`Procesando hoja: ${sheetName}`);
        
        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`Registros encontrados: ${jsonData.length}`);
        
        // Crear directorio de salida si no existe
        const outputDir = path.dirname(outputJsonPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Guardar como JSON
        fs.writeFileSync(outputJsonPath, JSON.stringify(jsonData, null, 2));
        
        console.log(`✅ Archivo convertido exitosamente: ${outputJsonPath}`);
        console.log(`📊 Primeros 3 registros:`);
        console.log(JSON.stringify(jsonData.slice(0, 3), null, 2));
        
        return jsonData;
    } catch (error) {
        console.error('❌ Error al convertir el archivo:', error.message);
        throw error;
    }
}

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

// Configuración principal
const baseDir = 'C:\\Users\\merce\\Escritorio\\ProductosSinPestaña';

// Ejecutar el script
console.log('🔍 Buscando archivos Excel...');
const excelFiles = findExcelFiles(baseDir);

if (excelFiles.length === 0) {
    console.log('❌ No se encontraron archivos Excel en la carpeta especificada.');
    console.log(`📁 Carpeta buscada: ${baseDir}`);
    console.log('💡 Asegúrate de que:');
    console.log('   1. La carpeta existe');
    console.log('   2. Contiene archivos .xlsx o .xls');
    console.log('');
    console.log('🔧 Alternativas:');
    console.log('   1. Verifica la ruta del directorio');
    console.log('   2. O ejecuta: node excelToJson.js "ruta/al/archivo.xlsx"');
} else {
    // Usar el primer archivo Excel encontrado
    const excelFile = excelFiles[0];
    const outputFile = './productos.json';
    
    console.log(`📊 Procesando: ${path.basename(excelFile)}`);
    
    try {
        const productos = excelToJson(excelFile, outputFile);
        console.log(`\n✅ ¡Conversión completada!`);
        console.log(`📁 Archivo JSON generado: ${outputFile}`);
        console.log(`📊 Total de productos: ${productos.length}`);
        
        // Mostrar estructura de campos disponibles
        if (productos.length > 0) {
            console.log('\n📋 Campos disponibles en los datos:');
            Object.keys(productos[0]).forEach((key, index) => {
                console.log(`   ${index + 1}. ${key}`);
            });
        }
    } catch (error) {
        console.error('❌ Error en la conversión:', error.message);
    }
}

// Permitir uso con parámetros de línea de comandos
if (process.argv.length > 2) {
    const customExcelPath = process.argv[2];
    const customOutputPath = process.argv[3] || './productos_custom.json';
    
    console.log('\n🔧 Modo personalizado activado');
    console.log(`📁 Archivo Excel: ${customExcelPath}`);
    console.log(`📄 Archivo de salida: ${customOutputPath}`);
    
    try {
        const productos = excelToJson(customExcelPath, customOutputPath);
        console.log(`\n✅ ¡Conversión personalizada completada!`);
        console.log(`📊 Total de productos: ${productos.length}`);
    } catch (error) {
        console.error('❌ Error en la conversión personalizada:', error.message);
    }
}

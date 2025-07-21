const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Importar tu configuración existente de Sequelize
const { Product, Category, conn } = require('./src/data');
const { Op } = require('sequelize');

async function loadProductsWithSequelize() {
    let transaction;
    
    try {
        console.log('🚀 Iniciando carga de productos con Sequelize...');
        
        // Verificar conexión
        await conn.authenticate();
        console.log('✅ Conexión a la base de datos establecida');
        
        // Leer el archivo JSON
        const jsonPath = path.join(__dirname, 'productos_custom.json');
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`❌ No se encontró el archivo: ${jsonPath}`);
        }
        
        const productosJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`📦 ${productosJson.length} productos encontrados en JSON`);
        
        // 🔥 NUEVA ESTRATEGIA: Crear todas las categorías ANTES de los productos
        console.log('📂 Preparando categorías...');
        
        // Extraer todas las categorías únicas del JSON
        const categoriasUnicas = new Set();
        const subcategoriasUnicas = new Map(); // subcategoria -> categoria_padre
        
        productosJson.forEach(producto => {
            if (producto.CATEGORIA) {
                categoriasUnicas.add(producto.CATEGORIA);
            }
            if (producto.SUBCATEGORIA && producto.CATEGORIA) {
                subcategoriasUnicas.set(producto.SUBCATEGORIA, producto.CATEGORIA);
            } else if (producto.SUBCATEGORIA && !producto.CATEGORIA) {
                // Si solo tiene subcategoría, la tratamos como categoría principal
                categoriasUnicas.add(producto.SUBCATEGORIA);
            }
        });
        
        console.log(`📁 Categorías encontradas: ${categoriasUnicas.size}`);
        console.log(`📂 Subcategorías encontradas: ${subcategoriasUnicas.size}`);
        
        // Crear mapas para categorías
        const categoryMap = new Map(); // name -> category object
        const categoryHierarchyMap = new Map(); // "parent->child" -> child category object
        
        // Obtener categorías existentes
        const existingCategories = await Category.findAll({
            attributes: ['id', 'name', 'parentId']
        });
        
        // Llenar mapas con categorías existentes
        existingCategories.forEach(cat => {
            categoryMap.set(cat.name.toLowerCase(), cat);
            if (cat.parentId) {
                const parentCat = existingCategories.find(p => p.id === cat.parentId);
                if (parentCat) {
                    const hierarchyKey = `${parentCat.name.toLowerCase()}->${cat.name.toLowerCase()}`;
                    categoryHierarchyMap.set(hierarchyKey, cat);
                }
            }
        });
        
        let categoriasCreadas = 0;
        let subcategoriasCreadas = 0;
        
        // 1. Crear categorías principales
        for (const categoriaName of categoriasUnicas) {
            const categoryKey = categoriaName.toLowerCase();
            
            if (!categoryMap.has(categoryKey)) {
                try {
                    const newCategory = await Category.create({
                        name: categoriaName,
                        description: `Categoría: ${categoriaName}`,
                        parentId: null,
                        isActive: true
                    });
                    
                    categoryMap.set(categoryKey, newCategory);
                    categoriasCreadas++;
                    console.log(`📁 Nueva categoría principal creada: ${categoriaName}`);
                    
                } catch (error) {
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        // Si ya existe, buscarla y agregarla al mapa
                        const existingCat = await Category.findOne({ where: { name: categoriaName } });
                        if (existingCat) {
                            categoryMap.set(categoryKey, existingCat);
                            console.log(`📁 Categoría existente encontrada: ${categoriaName}`);
                        }
                    } else {
                        console.error(`❌ Error creando categoría ${categoriaName}:`, error.message);
                    }
                }
            }
        }
        
        // 2. Crear subcategorías
        for (const [subcategoriaName, categoriaParent] of subcategoriasUnicas) {
            const parentKey = categoriaParent.toLowerCase();
            const childKey = subcategoriaName.toLowerCase();
            const hierarchyKey = `${parentKey}->${childKey}`;
            
            if (!categoryHierarchyMap.has(hierarchyKey) && !categoryMap.has(childKey)) {
                const parentCategory = categoryMap.get(parentKey);
                
                if (parentCategory) {
                    try {
                        const newSubcategory = await Category.create({
                            name: subcategoriaName,
                            description: `Subcategoría de ${categoriaParent}`,
                            parentId: parentCategory.id,
                            isActive: true
                        });
                        
                        categoryMap.set(childKey, newSubcategory);
                        categoryHierarchyMap.set(hierarchyKey, newSubcategory);
                        subcategoriasCreadas++;
                        console.log(`📂 Nueva subcategoría creada: ${categoriaParent} -> ${subcategoriaName}`);
                        
                    } catch (error) {
                        if (error.name === 'SequelizeUniqueConstraintError') {
                            // Si ya existe, buscarla y agregarla al mapa
                            const existingSubcat = await Category.findOne({ where: { name: subcategoriaName } });
                            if (existingSubcat) {
                                categoryMap.set(childKey, existingSubcat);
                                categoryHierarchyMap.set(hierarchyKey, existingSubcat);
                                console.log(`📂 Subcategoría existente encontrada: ${subcategoriaName}`);
                            }
                        } else {
                            console.error(`❌ Error creando subcategoría ${subcategoriaName}:`, error.message);
                        }
                    }
                }
            }
        }
        
        console.log(`✅ Preparación de categorías completada`);
        console.log(`📁 Categorías principales creadas: ${categoriasCreadas}`);
        console.log(`📂 Subcategorías creadas: ${subcategoriasCreadas}`);
        
        // Ahora procesar productos CON transacción
        transaction = await conn.transaction();
        
        let creados = 0;
        let errores = 0;
        let omitidos = 0;
        
        // Procesar productos en lotes
        const batchSize = 25; // Reducido para evitar problemas
        for (let i = 0; i < productosJson.length; i += batchSize) {
            const batch = productosJson.slice(i, i + batchSize);
            
            for (const [index, producto] of batch.entries()) {
                try {
                    // Verificar si el producto ya existe por SKU
                    if (producto.sku) {
                        const existingProduct = await Product.findOne({
                            where: { sku: producto.sku },
                            transaction
                        });
                        
                        if (existingProduct) {
                            omitidos++;
                            continue;
                        }
                    }
                    
                    // Determinar categoryId final
                    let finalCategoryId = null;
                    
                    if (producto.CATEGORIA && producto.SUBCATEGORIA) {
                        // Usar subcategoría
                        const hierarchyKey = `${producto.CATEGORIA.toLowerCase()}->${producto.SUBCATEGORIA.toLowerCase()}`;
                        const subcategory = categoryHierarchyMap.get(hierarchyKey);
                        finalCategoryId = subcategory ? subcategory.id : null;
                        
                    } else if (producto.CATEGORIA) {
                        // Usar categoría principal
                        const category = categoryMap.get(producto.CATEGORIA.toLowerCase());
                        finalCategoryId = category ? category.id : null;
                        
                    } else if (producto.SUBCATEGORIA) {
                        // Usar subcategoría como categoría principal
                        const category = categoryMap.get(producto.SUBCATEGORIA.toLowerCase());
                        finalCategoryId = category ? category.id : null;
                    }
                    
                    // Preparar datos del producto
                    const productData = {
            sku: producto.sku || `AUTO-${Date.now()}-${i + index}`,
            name: producto.Name || producto.name || 'Producto sin nombre',
            description: producto.description ||
                (producto.CATEGORIA && producto.SUBCATEGORIA ?
                    `${producto.CATEGORIA} - ${producto.SUBCATEGORIA}` :
                    producto.CATEGORIA || producto.SUBCATEGORIA || null),
            purchasePrice: parseFloat(producto['purchase price'] || producto.purchasePrice || 0),
            price: parseFloat(producto.price || 0),
            distributorPrice: producto.distributorPrice ? parseFloat(producto.distributorPrice) : null,
            stock: parseInt(producto['Stock actual'] || producto.stock || 0),
            minStock: parseInt(producto['Stock mínimo'] || producto.minStock || 5),
            isPromotion: (producto.isPromotion === 'true' || producto.isPromotion === true),
            isFacturable: (producto.Facturable === 'true' || producto.isFacturable === 'true' || producto.isFacturable === true),
            promotionPrice: producto['Precio de promoción'] ? parseFloat(producto['Precio de promoción']) : null,
            categoryId: finalCategoryId,
            tags: [],
            image_url: [],
            specificAttributes: null,
            isActive: true
        };

        // Crear el producto
        await Product.create(productData, { transaction });
        creados++;

        if (creados % 25 === 0) {
            console.log(`📈 Progreso: ${creados} productos creados...`);
        }

    } catch (error) {
        errores++;
        // Log mejorado: muestra el índice, el SKU, el nombre, la categoría, subcategoría y el motivo exacto
        console.error(`❌ Error procesando producto ${i + index + 1}: ${error.message}`);
        console.error(`   SKU: ${producto.sku || 'N/A'} | Nombre: ${producto.Name || producto.name || 'N/A'}`);
        console.error(`   Categoría: ${producto.CATEGORIA || 'N/A'} | Subcategoría: ${producto.SUBCATEGORIA || 'N/A'}`);
        console.error(`   Datos:`, JSON.stringify(producto, null, 2));
        if (!finalCategoryId) {
            console.error('   ⚠️ Motivo: No se encontró categoryId para este producto. Revisa los nombres de categoría/subcategoría.');
        }
    }
}
        }
        
        // Confirmar transacción
        await transaction.commit();
        
        console.log(`
🎉 ¡Carga completada exitosamente!
✅ Productos creados: ${creados}
📁 Categorías principales creadas: ${categoriasCreadas}
📂 Subcategorías creadas: ${subcategoriasCreadas}
⚠️  Productos omitidos (duplicados): ${omitidos}
❌ Errores: ${errores}
📊 Total procesados: ${productosJson.length}
        `);
        
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.error('❌ Error en la carga:', error.message);
        throw error;
    } finally {
        await conn.close();
        console.log('🔌 Conexión cerrada');
    }
}

// Ejecutar
loadProductsWithSequelize().catch(console.error);
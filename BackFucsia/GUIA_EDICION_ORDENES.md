# 🔄 Guía de Edición y Reversión de Órdenes de Compra

## 📋 Resumen de Funcionalidades

Este sistema permite gestionar errores en órdenes de compra mediante dos mecanismos principales:

### 1️⃣ **Edición de Órdenes (PUT /api/purchase/orders/:id)**
Para órdenes **pendientes** o **parciales** - Permite modificar items, cantidades y precios con reversión automática de stock.

### 2️⃣ **Reversión de Órdenes (POST /api/purchase/orders/:id/revert)**
Para órdenes **completadas** o **parciales** - Deshace completamente la recepción de mercancía.

---

## 🛠️ 1. EDICIÓN DE ÓRDENES

### ¿Cuándo usar?
- ✅ Orden está en estado `pendiente` o `parcial`
- ✅ Necesitas modificar cantidades, precios, o agregar/eliminar items
- ✅ Algunos items ya fueron recibidos pero necesitas ajustar los pendientes

### ✨ Características

#### Reversión Automática de Stock
Cuando editas una orden que ya tiene items recibidos:

**Caso 1: Eliminar un item recibido**
```javascript
// Orden original tiene:
Item A: 100 unidades ordenadas, 50 recibidas

// Usuario elimina Item A de la orden
// ✅ El sistema automáticamente:
// - Reduce stock del producto en 50 unidades
// - Crea movimiento de stock tipo "salida" con motivo "Reversión por edición de orden"
```

**Caso 2: Reducir cantidad recibida**
```javascript
// Orden original tiene:
Item B: 100 unidades ordenadas, 80 recibidas

// Usuario edita Item B y cambia cantidadRecibida de 80 a 60
// ✅ El sistema automáticamente:
// - Reduce stock del producto en 20 unidades (diferencia)
// - Crea movimiento de stock tipo "salida" con ajuste
```

**Caso 3: Agregar nuevos items**
```javascript
// ✅ Se pueden agregar nuevos items sin afectar lo ya recibido
// Los nuevos items quedan en estado "pendiente" (cantidadRecibida = 0)
```

### 🔒 Restricciones

- ❌ **NO permite editar órdenes completadas** → Usar reversión
- ❌ **NO permite editar órdenes canceladas** 
- ⚠️ **Valida que no quede stock negativo** al revertir

### 📝 Ejemplo de Uso (Frontend)

```javascript
// Editar orden existente
const orderData = {
  proveedorId: "uuid-proveedor",
  fechaCompra: "2025-01-15",
  numeroFactura: "FAC-001",
  metodoPago: "credito",
  impuestos: 0,
  descuentos: 0,
  items: [
    {
      id: "uuid-item-1", // ✅ Mantener ID si es item existente
      productId: "uuid-producto",
      productName: "Producto A",
      cantidad: 150, // Modificada de 100 a 150
      cantidadRecibida: 50, // Mantener cantidad ya recibida
      precioUnitario: 1000
    },
    // Item nuevo (sin ID)
    {
      productName: "Producto B Nuevo",
      productSku: "SKU-B",
      cantidad: 50,
      cantidadRecibida: 0, // Nuevo item, nada recibido aún
      precioUnitario: 2000,
      isNewProduct: true,
      categoryId: "uuid-categoria"
    }
    // ✅ Si se omite un item que tenía cantidadRecibida > 0,
    // se revertirá su stock automáticamente
  ]
};

const response = await axios.put(`/api/purchase/orders/${orderId}`, orderData);

// Respuesta incluye información de stock revertido:
/*
{
  error: false,
  message: "Orden actualizada exitosamente. Se revirtieron 30 unidades de stock.",
  data: { ...ordenActualizada },
  stockChanges: {
    unitsReverted: 30,
    movementsCreated: 2
  }
}
*/
```

---

## 🔄 2. REVERSIÓN DE ÓRDENES

### ¿Cuándo usar?
- ✅ Orden está `completada` o `parcial`
- ✅ Necesitas deshacer **toda** la recepción de mercancía
- ✅ Error crítico (productos defectuosos, recepción incorrecta, etc.)
- ✅ Devolución completa al proveedor

### ✨ Características

#### Acciones Automáticas
1. **Reversión de Stock**
   - Reduce stock de TODOS los productos con `cantidadRecibida > 0`
   - Valida que no quede stock negativo
   - Crea movimientos de stock tipo "salida" con motivo de reversión

2. **Eliminación de Gastos**
   - Elimina automáticamente los `Expense` creados con `isFromPurchaseOrder: true`
   - Mantiene integridad financiera

3. **Actualización de Estado**
   - Orden pasa a estado `pendiente`
   - `cantidadRecibida` de todos los items se resetea a `0`
   - Se agrega nota con timestamp y motivo de reversión

### 🔒 Validaciones Críticas

```javascript
// ❌ ERROR: Stock insuficiente
// Si el producto ya se vendió o usó después de recibirlo:
{
  error: true,
  message: "No se puede revertir la orden. El producto 'ROSETAS' no tiene suficiente stock.",
  details: {
    productName: "ROSETAS",
    currentStock: 30,
    quantityToRevert: 100,
    resultingStock: -70 // ❌ Stock negativo no permitido
  },
  hint: "Verifique que no se hayan realizado ventas de este producto después de la recepción."
}
```

### 📝 Ejemplo de Uso (Frontend)

```javascript
const revertOrder = async (orderId, reason) => {
  const response = await axios.post(`/api/purchase/orders/${orderId}/revert`, {
    reason: "Productos recibidos con defectos de fabricación. Se devolverán al proveedor."
  });

  // Respuesta exitosa:
  /*
  {
    error: false,
    message: "Orden revertida exitosamente. Stock y gastos fueron restaurados.",
    data: {
      orderNumber: "PC2025100020",
      previousStatus: "completada",
      newStatus: "pendiente",
      summary: {
        totalUnitsReverted: 108,
        productsAffected: 9,
        stockMovementsCreated: 9,
        expensesDeleted: 1,
        reason: "Productos recibidos con defectos..."
      }
    }
  }
  */
};
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: Producto Recibido con Cantidad Incorrecta

**Escenario:** Se recibieron 100 unidades pero solo debían ser 80.

**Solución:**
```javascript
// Opción A: Editar la orden ANTES de marcarla como completada
PUT /api/purchase/orders/:id
{
  items: [
    {
      id: "item-uuid",
      cantidad: 80, // Corregir cantidad ordenada
      cantidadRecibida: 100 // Cantidad incorrecta recibida
      // ⚠️ Esto dejará la orden en estado "completada" incorrectamente
    }
  ]
}

// Opción B (RECOMENDADA): Revertir completamente y volver a recibir
POST /api/purchase/orders/:id/revert
{ reason: "Cantidad recibida incorrecta, se revierte para ajustar" }

// Luego recibir de nuevo con la cantidad correcta
POST /api/purchase/orders/:id/receive
{
  receivedItems: [
    { itemId: "item-uuid", cantidadRecibida: 80 }
  ]
}
```

### Caso 2: Orden Generada Completamente por Error

**Escenario:** Se creó una orden y se recibió toda la mercancía, pero la orden completa es un error (pedido duplicado, proveedor incorrecto, etc.)

**Solución:**
```javascript
// Revertir la orden completada
POST /api/purchase/orders/:id/revert
{
  reason: "Orden duplicada por error. Ya existe la orden PC2025100015 con los mismos items."
}

// Resultado:
// ✅ Stock se reduce en todas las unidades recibidas
// ✅ Expense automático se elimina
// ✅ Orden pasa a "pendiente"
// ✅ Puedes cancelarla luego con PATCH /orders/:id/status
```

### Caso 3: Ajustar Items de Orden Parcialmente Recibida

**Escenario:** Orden con 10 items, 5 ya recibidos, necesitas eliminar 2 items pendientes y ajustar cantidades de otros.

**Solución:**
```javascript
PUT /api/purchase/orders/:id
{
  items: [
    // ✅ Mantener items ya recibidos (con sus IDs originales)
    { id: "item-1", cantidad: 100, cantidadRecibida: 100, ... },
    { id: "item-2", cantidad: 50, cantidadRecibida: 50, ... },
    { id: "item-3", cantidad: 75, cantidadRecibida: 30, ... }, // Ajustar cantidad ordenada
    { id: "item-4", cantidad: 200, cantidadRecibida: 0, ... }, // Pendiente, ajustado
    { id: "item-5", cantidad: 150, cantidadRecibida: 0, ... }, // Pendiente, ajustado
    
    // ❌ Omitir items que se quieren eliminar (se revertirá su stock si fueron recibidos)
    // No incluir item-6, item-7, etc.
    
    // ✅ Agregar nuevos items
    { productName: "Nuevo Item", cantidad: 100, isNewProduct: true, ... }
  ]
}

// El sistema automáticamente:
// - Revierte stock de items eliminados que tenían cantidadRecibida > 0
// - Mantiene el stock de items conservados
// - Deja los nuevos items como pendientes
```

---

## 🚨 Advertencias y Mejores Prácticas

### ⚠️ Advertencias

1. **Stock Negativo NO Permitido**
   - Si intentas revertir una orden y algún producto ya se vendió, la reversión fallará
   - Verifica el historial de ventas antes de revertir

2. **Reversión es Irreversible Automáticamente**
   - No hay "deshacer reversión" automático
   - Deberás volver a recibir la mercancía manualmente
   - Se mantiene historial completo en `notas` de la orden

3. **Expenses Automáticos**
   - Solo se eliminan expenses con `isFromPurchaseOrder: true`
   - Expenses manuales NO se afectan

### ✅ Mejores Prácticas

1. **Antes de Revertir:**
   ```javascript
   // Verificar stock actual de productos
   GET /api/products
   
   // Verificar movimientos de stock recientes
   GET /api/stock/movements?purchaseOrderId={orderId}
   
   // Verificar ventas desde la fecha de recepción
   GET /api/orders?startDate={fechaRecepcion}
   ```

2. **Documentar Motivos Claramente:**
   ```javascript
   // ❌ MAL
   { reason: "Error" }
   
   // ✅ BIEN
   { 
     reason: "Productos recibidos no cumplen especificaciones de calidad. " +
             "Contacto con proveedor: María Gómez (tel: 555-1234). " +
             "Se coordinará devolución el 20/01/2025. " +
             "Orden de reemplazo pendiente: PC2025100025"
   }
   ```

3. **Flujo Recomendado para Correcciones:**
   ```
   1. Identificar el problema
   2. Verificar stock disponible (si aplicable)
   3. Documentar el motivo detalladamente
   4. Ejecutar reversión/edición
   5. Verificar resultado en interfaz
   6. Actualizar documentación externa (si aplica)
   7. Coordinar con proveedor (si aplica)
   ```

---

## 📊 Registro de Cambios

### Movimientos de Stock Generados

Cada edición o reversión crea registros auditables:

```javascript
// Ejemplo de movimiento creado por reversión
{
  productId: "uuid-producto",
  quantity: 100,
  type: "salida", // ✅ Siempre "salida" en reversiones
  reason: "Reversión de orden de compra PC2025100020",
  previousStock: 350,
  currentStock: 250,
  userId: "user-document",
  purchaseOrderId: "uuid-orden",
  notes: "REVERSIÓN: Productos recibidos con defectos de fabricación...",
  createdAt: "2025-01-15T10:30:00Z"
}
```

### Notas en Órdenes

Cada acción importante se registra en las `notas` de la orden:

```
[RECEPCIÓN 15/1/2025 10:00] ROSETAS: +100, SOPORTE: +5 | 2 productos actualizados

[EDICIÓN 15/1/2025 11:30] Orden actualizada - 30 unidades de stock revertidas. Ajuste de cantidades por error de pedido

[REVERSIÓN 15/1/2025 14:45] Orden revertida a estado pendiente. 108 unidades devueltas al stock. 1 gasto(s) eliminado(s). Motivo: Productos recibidos con defectos de fabricación...
```

---

## 🧪 Testing

### Probar Edición de Orden

```javascript
// 1. Crear orden de prueba
POST /api/purchase/orders
{
  proveedorId: "...",
  items: [{ productName: "Test Product", cantidad: 100, ... }]
}

// 2. Recibir parcialmente
POST /api/purchase/orders/:id/receive
{
  receivedItems: [{ itemId: "...", cantidadRecibida: 50 }]
}

// 3. Intentar editar
PUT /api/purchase/orders/:id
{
  items: [
    { id: "...", cantidad: 80, cantidadRecibida: 50, ... } // Reducir cantidad
  ]
}

// ✅ Verificar: Stock NO debe cambiar (solo cambia la cantidad ordenada)

// 4. Eliminar item recibido
PUT /api/purchase/orders/:id
{
  items: [] // Vacío, elimina todos los items
}

// ✅ Verificar: Stock debe reducirse en 50 unidades
// ✅ Verificar: Debe existir movimiento de stock tipo "salida"
```

### Probar Reversión de Orden

```javascript
// 1. Crear y completar orden
POST /api/purchase/orders → Crear
POST /api/purchase/orders/:id/receive → Recibir todo

// 2. Verificar stock antes
GET /api/products/:productId
// Stock: 100

// 3. Revertir orden
POST /api/purchase/orders/:id/revert
{
  reason: "Test de reversión"
}

// ✅ Verificar: Stock debe volver a valor original
// ✅ Verificar: Expense debe eliminarse
// ✅ Verificar: Estado = "pendiente"
// ✅ Verificar: Todos los items con cantidadRecibida = 0
```

---

## 📞 Soporte

Si encuentras casos edge no cubiertos por esta documentación:

1. Verifica los logs del backend: `[UpdatePurchaseOrder]` y `[RevertOrder]`
2. Consulta movimientos de stock: `GET /api/stock/movements`
3. Revisa las notas de la orden para ver el historial completo

**Desarrollador:** Sistema implementado con transacciones atómicas para garantizar integridad de datos.

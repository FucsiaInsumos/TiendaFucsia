/**
 * 🧪 SCRIPT DE PRUEBA: Recepción de Mercancía
 * 
 * Este script prueba si el backend en producción tiene el fix del reload()
 * que corrige el problema de marcar órdenes como completadas cuando son parciales.
 * 
 * PROBLEMA ORIGINAL: Cuando se recibía parcialmente, el backend marcaba la orden como completada
 * SOLUCIÓN: Agregamos await purchaseOrder.reload() antes de verificar el estado
 */

const axios = require('axios');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const CONFIG = {
  // Cambiar según el ambiente a probar
  BACKEND_URL: 'https://tiendafucsia.up.railway.app',
  // BACKEND_URL: 'http://localhost:3001',
  
  // Token de autenticación (obtenerlo del localStorage del navegador)
  // Abre DevTools > Application > Local Storage > token
  AUTH_TOKEN: 'TU_TOKEN_AQUI', // <-- CAMBIAR ESTE TOKEN
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

const api = axios.create({
  baseURL: CONFIG.BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`
  }
});

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, emoji, message) {
  console.log(`${colors[color]}${emoji} ${message}${colors.reset}`);
}

// ============================================================================
// PRUEBAS
// ============================================================================

async function testPartialReception() {
  log('cyan', '🧪', '='.repeat(60));
  log('cyan', '🧪', 'TEST: Recepción PARCIAL de Mercancía');
  log('cyan', '🧪', '='.repeat(60));
  
  try {
    // 1. Obtener órdenes disponibles
    log('blue', '📋', 'Obteniendo órdenes de compra...');
    const ordersResponse = await api.get('/purchase/orders', {
      params: { status: '', proveedorId: '', startDate: '', endDate: '' }
    });
    
    const orders = ordersResponse.data.data || ordersResponse.data;
    
    if (!orders || orders.length === 0) {
      log('yellow', '⚠️', 'No hay órdenes disponibles para probar');
      return;
    }
    
    // Buscar una orden pendiente o parcial con múltiples items
    const testableOrder = orders.find(order => 
      (order.status === 'pendiente' || order.status === 'parcial') && 
      order.items && 
      order.items.length > 0
    );
    
    if (!testableOrder) {
      log('yellow', '⚠️', 'No hay órdenes pendientes o parciales con items para probar');
      log('yellow', '💡', 'Crea una orden de prueba con 3 items primero');
      return;
    }
    
    log('green', '✅', `Orden seleccionada: ${testableOrder.orderNumber}`);
    log('blue', '📦', `Estado actual: ${testableOrder.status}`);
    log('blue', '📦', `Total items: ${testableOrder.items.length}`);
    
    // Mostrar estado de cada item
    console.log('\n' + '─'.repeat(60));
    log('blue', '📊', 'Estado de Items:');
    testableOrder.items.forEach(item => {
      const recibida = item.cantidadRecibida || 0;
      const ordenada = item.cantidad;
      const pendiente = ordenada - recibida;
      log('blue', '  •', `${item.productName}: ${recibida}/${ordenada} (pendiente: ${pendiente})`);
    });
    console.log('─'.repeat(60) + '\n');
    
    // 2. Simular recepción PARCIAL
    // Encontrar el primer item con cantidad pendiente
    const itemWithPending = testableOrder.items.find(item => {
      const recibida = item.cantidadRecibida || 0;
      const ordenada = item.cantidad;
      return ordenada > recibida;
    });
    
    if (!itemWithPending) {
      log('yellow', '⚠️', 'Todos los items ya están completamente recibidos');
      return;
    }
    
    const cantidadPendiente = itemWithPending.cantidad - (itemWithPending.cantidadRecibida || 0);
    const cantidadARecibir = Math.min(Math.floor(cantidadPendiente / 2), cantidadPendiente - 1); // Recibir la mitad (parcial)
    
    if (cantidadARecibir <= 0) {
      log('yellow', '⚠️', 'No hay suficiente cantidad pendiente para hacer una recepción parcial');
      return;
    }
    
    log('yellow', '🔄', `Simulando recepción PARCIAL:`);
    log('yellow', '  •', `Item: ${itemWithPending.productName}`);
    log('yellow', '  •', `Cantidad pendiente: ${cantidadPendiente}`);
    log('yellow', '  •', `Cantidad a recibir: ${cantidadARecibir} (PARCIAL)`);
    log('yellow', '  •', `Quedará pendiente: ${cantidadPendiente - cantidadARecibir}`);
    
    const receivedItems = [{
      itemId: itemWithPending.id,
      cantidadRecibida: cantidadARecibir,
      updatePrices: false,
      newPrices: null
    }];
    
    // 3. Enviar recepción parcial
    log('blue', '📤', 'Enviando recepción parcial al servidor...');
    
    const response = await api.post(
      `/purchase/orders/${testableOrder.id}/receive`,
      { receivedItems, notes: 'Test automatizado de recepción parcial' }
    );
    
    // 4. Verificar respuesta
    console.log('\n' + '='.repeat(60));
    log('cyan', '📬', 'RESPUESTA DEL SERVIDOR:');
    console.log('='.repeat(60));
    
    const newStatus = response.data.data?.newStatus;
    const summary = response.data.data?.summary;
    
    log('blue', '📊', `Estado anterior: ${testableOrder.status}`);
    log('blue', '📊', `Estado nuevo: ${newStatus}`);
    
    if (summary) {
      log('blue', '📊', `Productos actualizados: ${summary.updatedProducts}`);
      log('blue', '📊', `Movimientos de stock: ${summary.stockMovements}`);
    }
    
    console.log('='.repeat(60) + '\n');
    
    // 5. VERIFICACIÓN CRÍTICA
    console.log('🔍 ANÁLISIS DEL RESULTADO:\n');
    
    const allItemsComplete = testableOrder.items.every(item => {
      if (item.id === itemWithPending.id) {
        // Este item ahora tiene más recibido pero no está completo
        const newRecibida = (item.cantidadRecibida || 0) + cantidadARecibir;
        return newRecibida >= item.cantidad;
      }
      // Los otros items mantienen su estado
      return (item.cantidadRecibida || 0) >= item.cantidad;
    });
    
    const expectedStatus = allItemsComplete ? 'completada' : 'parcial';
    
    if (newStatus === expectedStatus) {
      log('green', '✅', `CORRECTO: Estado es "${newStatus}" como se esperaba`);
      if (newStatus === 'parcial') {
        log('green', '✅', `El fix del reload() está funcionando correctamente`);
        log('green', '✅', `La orden NO se marcó como completada erróneamente`);
      }
    } else {
      log('red', '❌', `ERROR: Estado es "${newStatus}" pero debería ser "${expectedStatus}"`);
      if (newStatus === 'completada' && expectedStatus === 'parcial') {
        log('red', '❌', `BUG DETECTADO: Orden marcada como completada cuando es parcial`);
        log('red', '❌', `El servidor NO tiene el fix del reload()`);
        log('red', '❌', `Necesitas hacer deploy del código actualizado`);
      }
    }
    
    // 6. Obtener estado actualizado de la orden
    log('blue', '🔄', 'Verificando estado final en el servidor...');
    const updatedOrderResponse = await api.get('/purchase/orders', {
      params: { status: '', proveedorId: '', startDate: '', endDate: '' }
    });
    
    const updatedOrders = updatedOrderResponse.data.data || updatedOrderResponse.data;
    const updatedOrder = updatedOrders.find(o => o.id === testableOrder.id);
    
    if (updatedOrder) {
      console.log('\n' + '─'.repeat(60));
      log('cyan', '📊', 'Estado Final de la Orden:');
      log('blue', '  •', `Número: ${updatedOrder.orderNumber}`);
      log('blue', '  •', `Estado: ${updatedOrder.status}`);
      updatedOrder.items.forEach(item => {
        const recibida = item.cantidadRecibida || 0;
        const ordenada = item.cantidad;
        const completo = recibida >= ordenada;
        const emoji = completo ? '✅' : '⏳';
        log('blue', `  ${emoji}`, `${item.productName}: ${recibida}/${ordenada}`);
      });
      console.log('─'.repeat(60) + '\n');
    }
    
  } catch (error) {
    log('red', '❌', 'ERROR en la prueba:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// ============================================================================
// EJECUTAR PRUEBAS
// ============================================================================

async function main() {
  console.log('\n');
  log('magenta', '🚀', '='.repeat(60));
  log('magenta', '🚀', 'TEST DE RECEPCIÓN DE MERCANCÍA');
  log('magenta', '🚀', `Backend: ${CONFIG.BACKEND_URL}`);
  log('magenta', '🚀', '='.repeat(60));
  console.log('\n');
  
  // Verificar configuración
  if (CONFIG.AUTH_TOKEN === 'TU_TOKEN_AQUI') {
    log('red', '❌', 'ERROR: Debes configurar el AUTH_TOKEN');
    log('yellow', '💡', 'Obtén el token de: DevTools > Application > Local Storage > token');
    return;
  }
  
  try {
    await testPartialReception();
  } catch (error) {
    log('red', '❌', 'Error fatal en las pruebas');
    console.error(error);
  }
  
  console.log('\n');
  log('magenta', '🏁', '='.repeat(60));
  log('magenta', '🏁', 'FIN DE LAS PRUEBAS');
  log('magenta', '🏁', '='.repeat(60));
  console.log('\n');
}

// Ejecutar
main();

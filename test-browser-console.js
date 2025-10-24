/**
 * 🧪 SCRIPT DE PRUEBA RÁPIDA - EJECUTAR EN CONSOLA DEL NAVEGADOR
 * 
 * Copia y pega este código en la consola del navegador (F12)
 * cuando estés en tu aplicación de producción.
 * 
 * INSTRUCCIONES:
 * 1. Abre tu aplicación en producción
 * 2. Abre DevTools (F12)
 * 3. Ve a la pestaña Console
 * 4. Pega este código completo
 * 5. Presiona Enter
 * 6. Observa los resultados
 */

(async function testReceiveOrderFix() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST: Verificar Fix de Recepción Parcial');
  console.log('='.repeat(60) + '\n');

  try {
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No hay token de autenticación. Debes iniciar sesión primero.');
      return;
    }

    const baseURL = 'https://tiendafucsia.up.railway.app';
    
    // Crear función para hacer requests
    const api = async (method, url, data = null) => {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(baseURL + url, options);
      return response.json();
    };

    // 1. Obtener órdenes
    console.log('📋 Obteniendo órdenes...');
    const ordersData = await api('GET', '/purchase/orders?status=&proveedorId=&startDate=&endDate=');
    const orders = ordersData.data || ordersData;

    if (!orders || orders.length === 0) {
      console.warn('⚠️ No hay órdenes disponibles');
      return;
    }

    // Buscar orden con items pendientes
    const testOrder = orders.find(order => 
      (order.status === 'pendiente' || order.status === 'parcial') &&
      order.items &&
      order.items.some(item => (item.cantidadRecibida || 0) < item.cantidad)
    );

    if (!testOrder) {
      console.warn('⚠️ No hay órdenes con items pendientes');
      console.log('\n💡 RECOMENDACIÓN: Crea una orden de prueba con 3 items');
      console.log('   Luego recibe PARCIALMENTE solo 1 o 2 items');
      return;
    }

    console.log('\n✅ Orden encontrada:', testOrder.orderNumber);
    console.log('📊 Estado actual:', testOrder.status);
    console.log('📦 Items:');
    
    testOrder.items.forEach(item => {
      const recibida = item.cantidadRecibida || 0;
      const total = item.cantidad;
      const pendiente = total - recibida;
      console.log(`   • ${item.productName}: ${recibida}/${total} ${pendiente > 0 ? '⏳ PENDIENTE' : '✅ COMPLETO'}`);
    });

    // Encontrar item con cantidad pendiente
    const itemPendiente = testOrder.items.find(item => 
      (item.cantidadRecibida || 0) < item.cantidad
    );

    if (!itemPendiente) {
      console.warn('⚠️ Todos los items están completos');
      return;
    }

    const pendiente = itemPendiente.cantidad - (itemPendiente.cantidadRecibida || 0);
    const aRecibir = Math.max(1, Math.floor(pendiente / 2)); // Recibir la mitad

    console.log('\n🔄 Simulando recepción PARCIAL:');
    console.log(`   Item: ${itemPendiente.productName}`);
    console.log(`   Pendiente: ${pendiente}`);
    console.log(`   A recibir: ${aRecibir} (${Math.round(aRecibir/pendiente*100)}%)`);
    console.log(`   Quedará pendiente: ${pendiente - aRecibir}`);

    // Enviar recepción
    const receiveData = {
      receivedItems: [{
        itemId: itemPendiente.id,
        cantidadRecibida: aRecibir,
        updatePrices: false,
        newPrices: null
      }],
      notes: 'Test de recepción parcial'
    };

    console.log('\n📤 Enviando recepción al servidor...');
    const response = await api('POST', `/purchase/orders/${testOrder.id}/receive`, receiveData);

    // Verificar respuesta
    console.log('\n' + '='.repeat(60));
    console.log('📬 RESPUESTA DEL SERVIDOR:');
    console.log('='.repeat(60));
    console.log('Estado anterior:', testOrder.status);
    console.log('Estado nuevo:', response.data?.newStatus);
    
    // ANÁLISIS CRÍTICO
    console.log('\n🔍 ANÁLISIS:');
    
    const todosCompletos = testOrder.items.every(item => {
      if (item.id === itemPendiente.id) {
        const nuevaRecibida = (item.cantidadRecibida || 0) + aRecibir;
        return nuevaRecibida >= item.cantidad;
      }
      return (item.cantidadRecibida || 0) >= item.cantidad;
    });

    const estadoEsperado = todosCompletos ? 'completada' : 'parcial';
    const estadoRecibido = response.data?.newStatus;

    if (estadoRecibido === estadoEsperado) {
      console.log(`%c✅ CORRECTO: Estado es "${estadoRecibido}"`, 'color: green; font-weight: bold');
      if (estadoRecibido === 'parcial') {
        console.log('%c✅ El fix está funcionando - La orden NO se marcó como completada', 'color: green; font-weight: bold');
      }
    } else {
      console.log(`%c❌ ERROR: Estado es "${estadoRecibido}" pero debería ser "${estadoEsperado}"`, 'color: red; font-weight: bold');
      if (estadoRecibido === 'completada' && estadoEsperado === 'parcial') {
        console.log('%c❌ BUG: Orden marcada como completada cuando es PARCIAL', 'color: red; font-weight: bold');
        console.log('%c❌ El servidor NO tiene el fix del reload()', 'color: red; font-weight: bold');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(response.data?.isCompleted ? '✅ Orden COMPLETADA' : '⏳ Orden PARCIAL');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error);
  }
})();

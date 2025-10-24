// 🧪 TEST RÁPIDO - Pega esto en la consola después de escribir "allow pasting"

(async function() {
  console.log('\n🧪 TEST: Verificar Fix de Recepción Parcial\n');
  
  const token = localStorage.getItem('token');
  const baseURL = 'https://tiendafucsia.up.railway.app';
  
  const api = async (method, url, data = null) => {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    };
    if (data) opts.body = JSON.stringify(data);
    const res = await fetch(baseURL + url, opts);
    return res.json();
  };

  // Obtener órdenes
  const ordersData = await api('GET', '/purchase/orders?status=&proveedorId=&startDate=&endDate=');
  console.log('📦 Estructura de respuesta:', ordersData);
  
  let orders = ordersData.data || ordersData;
  
  // Si tiene paginación
  if (orders && typeof orders === 'object' && orders.orders) {
    orders = orders.orders;
  }
  
  // Si tiene rows (Sequelize)
  if (orders && typeof orders === 'object' && orders.rows) {
    orders = orders.rows;
  }
  
  if (!Array.isArray(orders)) {
    console.error('❌ La respuesta no es un array:', orders);
    return;
  }
  
  const testOrder = orders.find(o => 
    (o.status === 'pendiente' || o.status === 'parcial') &&
    o.items?.some(i => (i.cantidadRecibida || 0) < i.cantidad)
  );

  if (!testOrder) {
    console.log('⚠️ No hay órdenes con items pendientes');
    console.log('💡 Crea una orden de prueba con 3 items y recibe solo 1 o 2');
    return;
  }

  console.log('✅ Orden:', testOrder.orderNumber);
  console.log('📊 Estado actual:', testOrder.status);
  console.log('📦 Items:');
  testOrder.items.forEach(i => {
    const r = i.cantidadRecibida || 0;
    console.log(`   ${i.productName}: ${r}/${i.cantidad} ${r < i.cantidad ? '⏳' : '✅'}`);
  });

  const item = testOrder.items.find(i => (i.cantidadRecibida || 0) < i.cantidad);
  const pend = item.cantidad - (item.cantidadRecibida || 0);
  const recv = Math.max(1, Math.floor(pend / 2));

  console.log(`\n🔄 Recibiendo ${recv} de ${pend} unidades de "${item.productName}"`);

  const res = await api('POST', `/purchase/orders/${testOrder.id}/receive`, {
    receivedItems: [{ itemId: item.id, cantidadRecibida: recv, updatePrices: false, newPrices: null }],
    notes: 'Test'
  });

  console.log('\n📬 RESULTADO:');
  console.log('Estado anterior:', testOrder.status);
  console.log('Estado nuevo:', res.data?.newStatus);

  const todosCompletos = testOrder.items.every(i => {
    if (i.id === item.id) return (i.cantidadRecibida || 0) + recv >= i.cantidad;
    return (i.cantidadRecibida || 0) >= i.cantidad;
  });

  const esperado = todosCompletos ? 'completada' : 'parcial';
  
  if (res.data?.newStatus === esperado) {
    console.log('%c✅ CORRECTO: ' + (esperado === 'parcial' ? 'El fix está funcionando!' : 'Todo bien'), 'color: green; font-weight: bold; font-size: 16px');
  } else {
    console.log(`%c❌ ERROR: Es "${res.data?.newStatus}" pero debería ser "${esperado}"`, 'color: red; font-weight: bold; font-size: 16px');
    if (res.data?.newStatus === 'completada' && esperado === 'parcial') {
      console.log('%c❌ BUG: Railway NO tiene el fix del reload()', 'color: red; font-weight: bold');
    }
  }
})();

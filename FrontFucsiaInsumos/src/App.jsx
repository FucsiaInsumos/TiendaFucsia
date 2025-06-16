import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from './Redux/Actions/authActions';
import { recalculateCartOnUserChange } from './Redux/Reducer/cartReducer'; // Asegúrate que la ruta sea correcta
import { getDiscountRules } from './Redux/Actions/discountRuleActions';
import PrivateRoute from './Components/PrivateRoute';

// Importa tus componentes
import Navbar from './Components/Navbar';
import Login from './Components/Auth/Login';
import RegisterForm from './Components/Auth/RegisterForm';
import Dashboard from './Components/Dashboard/Dashboard';
import Tienda from './Components/Tienda/Tienda';
import NotFound from './Components/NotFound';
import Unauthorized from './Components/Auth/Unauthorized';
import Landing from './Components/Landing';
import CategoryManager from './Components/Categories/CategoryManager';
import ProductManager from './Components/Products/ProductManager';
import ProductCatalog from './Components/Shop/ProductCatalog';
import DiscountRuleManager from './Components/DiscountRules/DiscountRuleManager';
import DistributorManager from './Components/Distributors/DistributorManager';
import PriceCalculator from './Components/PriceCalculator/PriceCalculator';
import UserManagement from './Components/Dashboard/UserManagement/UserManagement';
import OrderManagement from './Components/Sales/OrderManagement';
import PaymentManagement from './Components/Sales/PaymentManagement';
import StockManagement from './Components/Stock/StockManagement';
import POS from './Components/POS/POS';
import CartSidebar from './Components/Cart/CartSidebar';
import Checkout from './Components/Checkout/Checkout';
import OrderConfirmation from './Components/Checkout/OrderConfirmation';
import MyOrders from './Components/Customer/MyOrders';

function App() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(state => state.auth);
 const {discountRules} = useSelector(state => state.discountRules);
 
 useEffect(() => {
    dispatch(getDiscountRules());
  }, [dispatch]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
   


    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(loginSuccess({ 
          token, 
          data: { user: parsedUser } 
        }));
        // El recalculate se hará en el siguiente useEffect al cambiar currentUser
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(recalculateCartOnUserChange(null)); 
      }
    } else {
      dispatch(recalculateCartOnUserChange(null));
    }
  }, [dispatch]);

  useEffect(() => {
    // Este efecto se dispara cada vez que currentUser (del store de auth) cambia.
    dispatch(recalculateCartOnUserChange(currentUser));
  }, [currentUser, dispatch]);

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/catalogo" element={<ProductCatalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['Owner']}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/categorias"
            element={
              <PrivateRoute allowedRoles={['Owner', 'Distributor']}>
                <CategoryManager />
              </PrivateRoute>
            }
          />

          <Route
            path="/productos"
            element={
              <PrivateRoute allowedRoles={['Owner', 'Distributor']}>
                <ProductManager />
              </PrivateRoute>
            }
          />

          <Route
            path="/reglas-descuento"
            element={
              <PrivateRoute allowedRoles={['Owner']}>
                <DiscountRuleManager />
              </PrivateRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <PrivateRoute allowedRoles={['Owner']}>
                <UserManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/usuarios/crear"
            element={
              <PrivateRoute allowedRoles={['Owner']}>
                <UserManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/distribuidores"
            element={
              <PrivateRoute allowedRoles={['Owner']}>
                <DistributorManager />
              </PrivateRoute>
            }
          />

          <Route
            path="/calculadora-precios"
            element={
              <PrivateRoute allowedRoles={['Owner', 'Cashier']}>
                <PriceCalculator />
              </PrivateRoute>
            }
          />

          {/* Rutas de ventas y caja */}
          <Route
            path="/caja"
            element={
              <PrivateRoute allowedRoles={['Owner', 'Cashier']}>
                <POS />
              </PrivateRoute>
            }
          />

          <Route
            path="/ordenes"
            element={
              <PrivateRoute allowedRoles={['Owner', 'Cashier']}>
                <OrderManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/pagos"
            element={
              <PrivateRoute allowedRoles={['Owner', 'Cashier']}>
                <PaymentManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/stock"
            element={
              <PrivateRoute allowedRoles={['Owner', 'Cashier']}>
                <StockManagement />
              </PrivateRoute>
            }
          />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

          {/* Nueva ruta para que usuarios comunes y distribuidores vean sus órdenes */}
          <Route
            path="/mis-ordenes"
            element={
              <PrivateRoute allowedRoles={['Customer', 'Distributor']}>
                <MyOrders />
              </PrivateRoute>
            }
          />

          {/* Renombrar la ruta existente de órdenes para que sea más específica para admin */}
          <Route
            path="/admin/ordenes"
            element={
              <PrivateRoute allowedRoles={['Owner', 'Cashier']}>
                <OrderManagement />
              </PrivateRoute>
            }
          />

          {/* Ruta por defecto para 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Cart Sidebar - siempre disponible */}
        <CartSidebar />
      </div>
    </BrowserRouter>
  );
}

export default App;


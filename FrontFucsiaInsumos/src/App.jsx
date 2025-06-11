import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './Redux/Actions/authActions';
import PrivateRoute from './Components/PrivateRoute';

// Importa tus componentes
import Navbar from './Components/Navbar';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import Tienda from './Components/Tienda/Tienda';
import NotFound from './Components/NotFound';
import Unauthorized from './Components/Auth/Unauthorized';
import Landing from './Components/Landing';
import CategoryManager from './Components/Categories/CategoryManager';
import ProductManager from './Components/Products/ProductManager';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Verificar si hay un token guardado al iniciar la app
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(loginSuccess({ 
          token, 
          data: { user: parsedUser } 
        }));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        // Limpiar localStorage si hay datos corruptos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          {/* Ruta por defecto para 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/Actions/authActions';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  console.log('Navbar user:', user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-principal">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src="/logoBlanco.jpg" alt="Fucsia Logo" className="h-16 lg:h-20 w-auto mr-2" />
          </Link>
      
        </div>
        <div className="flex space-x-4 pr-2">
          {isAuthenticated ? (
            <>
              {user && user.role === 'Owner' && (
                <Link to="/dashboard" className="text-white font-semibold">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="text-white font-semibold">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/signup" className="text-white font-bold">Registrate</Link>
              <Link to="/login" className="text-white font-bold">Ingresá</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
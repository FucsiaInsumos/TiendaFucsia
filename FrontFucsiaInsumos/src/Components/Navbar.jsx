import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/Actions/authActions';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-fuchsia-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Tienda Fucsia
        </div>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              {user && user.role === 'Owner' && (
                <Link to="/dashboard" className="text-white font-bold">Dashboard</Link>
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
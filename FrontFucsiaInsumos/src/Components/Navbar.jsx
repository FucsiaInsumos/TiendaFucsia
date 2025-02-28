import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/Actions/authActions'; 

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

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
            <button onClick={handleLogout} className="text-white font-semibold">Cerrar sesión</button>
          ) : (
            <>
              <a href="/signup" className="text-white font-bold">Registrate</a>
              <a href="/login" className="text-white font-bold">Ingresá</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
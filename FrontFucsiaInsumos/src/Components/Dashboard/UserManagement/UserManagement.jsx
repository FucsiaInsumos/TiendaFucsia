import React, { useState } from 'react';
import UserList from './UserList';
import AdminUserForm from './AdminUserForm';

const UserManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreateNew = () => {
    setSelectedUser(null);
    setCurrentView('create');
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setCurrentView('edit');
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setCurrentView('list')}
            className={`px-4 py-2 rounded-lg transition duration-150 ease-in-out ${
              currentView === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Lista de Usuarios
          </button>
          <button
            onClick={handleCreateNew}
            className={`px-4 py-2 rounded-lg transition duration-150 ease-in-out ${
              currentView === 'create'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Crear Usuario
          </button>
        </nav>
      </div>

      {currentView === 'list' && (
        <UserList 
          onEdit={handleEdit}
          onCreateNew={handleCreateNew}
        />
      )}

      {(currentView === 'create' || currentView === 'edit') && (
        <AdminUserForm
          initialData={selectedUser}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default UserManagement;

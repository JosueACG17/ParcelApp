import React from 'react';
import UsersCRUD from '../components/dashboard/UsersCRUD';

const UsersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UsersCRUD />
      </div>
    </div>
  );
};

export default UsersPage;
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#FAF7F2] shadow-lg border-b border-[#E6D8BE]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      
      {/* Brand */}
      <div className="flex items-center">
        <span className="text-2xl font-bold text-[#3E1F1F]">
          The Velvet Sweet Co.
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <span className="text-[#5A3A2E] font-medium">
          Welcome, {user?.name}!
        </span>

        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="bg-[#C9A24D] hover:bg-[#B08E3E] text-[#3E1F1F] px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200"
          >
            Admin Panel
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-[#3E1F1F] hover:bg-[#2B1414] text-[#FAF7F2] px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200"
        >
          Logout
        </button>
      </div>

    </div>
  </div>
</nav>

  );
};

export default Navbar;
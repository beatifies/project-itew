import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Search } from 'lucide-react';

const Header = ({ toggleSidebar, title }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const currentPath = window.location.pathname;
      navigate(`${currentPath}?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-orange-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-orange-600 transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none outline-none ml-2 text-gray-700 w-64"
              />
            </div>
          </form>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-orange-200 py-2">
                <div className="px-4 py-2 border-b border-orange-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-orange-50 cursor-pointer">
                    <p className="text-sm text-gray-700">New student enrolled</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-orange-50 cursor-pointer">
                    <p className="text-sm text-gray-700">Event scheduled tomorrow</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <span className="hidden md:block text-gray-700 font-medium">Admin User</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-orange-200 py-2">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-orange-50">Profile</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-orange-50">Settings</a>
                <hr className="border-orange-100 my-2" />
                <a href="#" className="block px-4 py-2 text-red-600 hover:bg-orange-50">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

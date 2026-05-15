import { LogOut, User, Store, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getRoleIcon = () => {
    if (user?.role === 'Admin') return <ShieldCheck size={20} className="text-indigo-600" />;
    if (user?.role === 'Store Owner') return <Store size={20} className="text-amber-600" />;
    return <User size={20} className="text-emerald-600" />;
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getRoleIcon()}
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              {title}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.role}</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 font-medium transition-colors p-2 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

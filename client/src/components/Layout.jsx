import Sidebar from './Sidebar';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Bell, ChevronRight, Home } from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex min-h-screen bg-gray-50 transition-colors duration-300">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center flex-1 max-w-xl gap-4">
            {/* Breadcrumbs */}
            <nav className="hidden lg:flex items-center space-x-2 text-sm font-medium text-gray-500">
              <Link to="/" className="hover:text-emerald-600 transition-colors text-gray-400">
                <Home size={16} />
              </Link>
              {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                return (
                  <div key={to} className="flex items-center space-x-2">
                    <ChevronRight size={14} className="text-gray-300" />
                    <Link 
                      to={to} 
                      className={`capitalize hover:text-emerald-600 transition-colors ${index === pathnames.length - 1 ? 'text-emerald-600 font-bold' : ''}`}
                    >
                      {value.replace('-', ' ')}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-600 font-medium text-sm transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

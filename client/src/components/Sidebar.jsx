import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Store, Star, UserCircle, 
  Settings, LogOut, ChevronLeft, ChevronRight,
  ShieldCheck, User
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/stores', icon: Store, label: 'Store Management' },
  ];

  const userLinks = [
    { to: '/dashboard', icon: Store, label: 'Explore Stores' },
    { to: '/profile', icon: UserCircle, label: 'My Profile' },
  ];

  const ownerLinks = [
    { to: '/owner', icon: LayoutDashboard, label: 'My Store' },
    { to: '/profile', icon: UserCircle, label: 'Store Settings' },
  ];

  const links = user?.role === 'Admin' ? adminLinks : 
                user?.role === 'Store Owner' ? ownerLinks : userLinks;

  return (
    <aside className={`bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-screen transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 flex items-center justify-between border-b dark:border-gray-700">
        {!collapsed && (
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
            StoreRating
          </span>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center space-x-3 p-3 rounded-xl transition-all
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600'}
            `}
          >
            <link.icon size={20} />
            {!collapsed && <span className="font-medium">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t dark:border-gray-700">
        <div className={`flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
            {user?.name?.[0]}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

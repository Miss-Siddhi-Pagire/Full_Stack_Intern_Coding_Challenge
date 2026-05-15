import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, MapPin, Star, LogOut, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, [search]);

  const fetchStores = async () => {
    try {
      const response = await api.get('/user/stores', { params: search });
      setStores(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">StoreRating</span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/change-password')}
                className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all shadow-sm"
              placeholder="Search by store name..."
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <MapPin size={18} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all shadow-sm"
              placeholder="Search by address..."
              value={search.address}
              onChange={(e) => setSearch({ ...search, address: e.target.value })}
            />
          </div>
        </div>

        {/* Store Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading stores...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => (
              <div key={store.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <LayoutGrid size={24} />
                  </div>
                  <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full text-amber-700 font-bold text-sm">
                    <Star size={14} className="fill-current mr-1" />
                    {Number(store.overall_rating || 0).toFixed(1)}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">
                  {store.address}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="text-xs text-gray-400">
                    Your Rating: <span className="font-bold text-gray-600">{store.user_rating || 'N/A'}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/rate/${store.id}`)}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {store.user_rating ? 'Modify Rating' : 'Rate Now →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;

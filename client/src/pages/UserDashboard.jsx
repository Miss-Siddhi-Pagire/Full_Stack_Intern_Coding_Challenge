import { useState, useEffect } from 'react';
import api from '../services/api';
import { Store, Star, Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '', sortBy: 'created_at', order: 'desc' });

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      const res = await api.get('/user/stores', { params: filters });
      setStores(res.data.data.stores);
    } catch (err) {
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((val) => {
    setFilters(prev => ({ ...prev, name: val }));
  }, 500);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">{[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-200 rounded-3xl"></div>)}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Explore Stores</h1>
          <p className="text-gray-500">Discover and rate the best places around you</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search stores..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border-none rounded-xl text-sm outline-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <select 
            className="p-2 bg-white dark:bg-gray-800 border-none rounded-xl text-sm ring-1 ring-gray-200 dark:ring-gray-700 outline-none dark:text-white"
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          >
            <option value="created_at">Latest</option>
            <option value="overall_rating">Top Rated</option>
            <option value="name">A-Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.map((store) => (
          <div key={store.id} className="group bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex items-end relative overflow-hidden">
              <Store className="absolute -top-4 -right-4 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform" />
              <div className="flex justify-between items-center w-full z-10">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold uppercase tracking-wider">
                  {store.owner_name}
                </div>
                <div className="flex items-center gap-1 bg-amber-400 px-2 py-1 rounded-lg text-amber-900 text-xs font-black">
                  <Star size={14} className="fill-current" />
                  {Number(store.overall_rating || 0).toFixed(1)}
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{store.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{store.address}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400">
                  {store.user_rating ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Star size={12} className="fill-current" /> You rated {store.user_rating}
                    </span>
                  ) : 'Not rated yet'}
                </div>
                <Link 
                  to={`/rate/${store.id}`} 
                  className="p-2 bg-gray-50 dark:bg-gray-900 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed dark:border-gray-700">
          <Store size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No stores found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

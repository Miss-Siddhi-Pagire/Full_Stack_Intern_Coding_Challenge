import { useState, useEffect } from 'react';
import api from '../services/api';
import { Store, Star, Search, Filter, ArrowRight, MapPin, Edit3 } from 'lucide-react';
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

  const handleSearch = debounce((field, val) => {
    setFilters(prev => ({ ...prev, [field]: val }));
  }, 500);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">{[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-200 rounded-3xl"></div>)}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Explore Stores</h1>
          <p className="text-gray-500">Discover and rate the best places around you</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Store Name..." 
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-600"
              onChange={(e) => handleSearch('name', e.target.value)}
            />
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Location/Address..." 
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-600"
              onChange={(e) => handleSearch('address', e.target.value)}
            />
          </div>
          <select 
            className="p-2 bg-white border rounded-xl text-sm outline-none cursor-pointer"
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          >
            <option value="created_at">Latest Added</option>
            <option value="overall_rating">Highest Rated</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.map((store) => (
          <div key={store.id} className="group bg-white rounded-3xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-700 p-6 flex flex-col justify-between relative overflow-hidden text-white">
              <Store className="absolute -top-4 -right-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform" />
              <div className="flex justify-between items-center z-10">
                <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                  Verified Store
                </span>
                <div className="flex items-center gap-1 bg-amber-400 px-2 py-1 rounded-lg text-amber-900 text-xs font-black">
                  <Star size={14} className="fill-current" />
                  {Number(store.overall_rating || 0).toFixed(1)}
                </div>
              </div>
              <h3 className="text-xl font-bold z-10 leading-tight">{store.name}</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-2 text-gray-500">
                <MapPin size={16} className="mt-1 shrink-0" />
                <p className="text-sm line-clamp-2">{store.address}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs font-bold">
                  {store.user_rating ? (
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      <Star size={12} className="fill-current" /> You rated {store.user_rating}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not rated yet</span>
                  )}
                </div>
                <Link 
                  to={`/rate/${store.id}`} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    store.user_rating 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                  }`}
                >
                  {store.user_rating ? (
                    <><Edit3 size={16} /> Edit</>
                  ) : (
                    <><Star size={16} /> Rate</>
                  )}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
          <Store size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium italic">No stores found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

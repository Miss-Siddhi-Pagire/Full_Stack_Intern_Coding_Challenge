import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Store, Edit, Trash2, Search, ChevronLeft, ChevronRight, Star, Plus
} from 'lucide-react';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ name: '', page: 1 });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      const res = await api.get('/admin/stores', { params: filters });
      setStores(res.data.data.stores);
      setPagination({ page: res.data.data.page, totalPages: res.data.data.totalPages });
    } catch (err) {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((val) => {
    setFilters(prev => ({ ...prev, name: val, page: 1 }));
  }, 500);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this store?')) return;
    try {
      await api.delete(`/admin/stores/${id}`);
      toast.success('Store removed');
      fetchStores();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/stores/${editingId}`, formData);
        toast.success('Store updated');
      } else {
        await api.post('/admin/stores', formData);
        toast.success('Store created');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
    } catch (err) { toast.error(err.response?.data?.message || 'Submission failed'); }
  };

  if (loading && filters.page === 1) return <div className="space-y-4 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Store Management</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search stores..." 
              className="pl-9 pr-4 py-2 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {setShowForm(true); setEditingId(null)}}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Plus size={18} /> Add Store
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-6 dark:text-white">{editingId ? 'Edit Store' : 'Add New Store'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Store Name" required className="p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Store Email" required className="p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="number" placeholder="Owner User ID" required className="p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={formData.owner_id} onChange={e => setFormData({...formData, owner_id: e.target.value})} />
            <input type="text" placeholder="Store Address" required className="p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Save Store</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-xl font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stores.map(s => (
          <div key={s.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700 flex justify-between items-start">
            <div className="flex gap-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl h-fit">
                <Store size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold dark:text-white">{s.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{s.address}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star size={14} className="fill-current" />
                    {Number(s.overall_rating || 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Owner: {s.owner_name} (ID: #{s.owner_id})</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => {setEditingId(s.id); setFormData(s); setShowForm(true)}} className="p-2 text-gray-400 hover:text-indigo-600"><Edit size={18}/></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button 
          disabled={filters.page === 1}
          onClick={() => setFilters({...filters, page: filters.page - 1})}
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-bold text-gray-900 dark:text-white">Page {pagination.page} of {pagination.totalPages}</span>
        <button 
          disabled={filters.page === pagination.totalPages}
          onClick={() => setFilters({...filters, page: filters.page + 1})}
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default StoreManagement;

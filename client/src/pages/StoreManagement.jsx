import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Store, Edit, Trash2, Search, ChevronLeft, ChevronRight, Star, Plus, ArrowUpDown, Eye, UserCheck
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const StoreManagement = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ name: '', sortBy: 'id', order: 'asc', page: 1 });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStores();
    fetchOwners();
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

  const fetchOwners = async () => {
    try {
      const res = await api.get('/admin/users', { params: { role: 'Store Owner', limit: 100 } });
      setOwners(res.data.data.users);
    } catch (err) { console.error('Failed to load owners'); }
  };

  const handleSearch = debounce((val) => {
    setFilters(prev => ({ ...prev, name: val, page: 1 }));
  }, 500);

  const handleSort = (column) => {
    const newOrder = filters.sortBy === column && filters.order === 'asc' ? 'desc' : 'asc';
    setFilters({ ...filters, sortBy: column, order: newOrder, page: 1 });
  };

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
    if (!formData.owner_id) {
      toast.warning('Please select a Store Owner');
      return;
    }
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
        <h1 className="text-2xl font-black text-gray-900">Store Management</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search stores..." 
              className="pl-9 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-600"
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

      <div className="flex gap-4 overflow-x-auto pb-2">
        {[
          { label: 'Name', col: 'name' },
          { label: 'Rating', col: 'overall_rating' },
          { label: 'Newest', col: 'created_at' }
        ].map(s => (
          <button 
            key={s.col}
            onClick={() => handleSort(s.col)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 whitespace-nowrap ${filters.sortBy === s.col ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 hover:border-indigo-600'}`}
          >
            Sort by {s.label} <ArrowUpDown size={12} />
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Store className="text-indigo-600" /> {editingId ? 'Edit Store' : 'Create New Store'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">Store Name</label>
              <input type="text" placeholder="Enter name" required className="w-full p-3 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">Business Email</label>
              <input type="email" placeholder="email@store.com" required className="w-full p-3 border rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">Assigned Owner</label>
              <select 
                required 
                className="w-full p-3 border rounded-xl bg-white" 
                value={formData.owner_id} 
                onChange={e => setFormData({...formData, owner_id: e.target.value})}
              >
                <option value="">Select a Store Owner...</option>
                {owners.map(o => (
                  <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">Address</label>
              <input type="text" placeholder="Street address, City" required className="w-full p-3 border rounded-xl" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="md:col-span-2 flex gap-2 pt-4">
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                {editingId ? 'Update Store Details' : 'Create Store'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">Cancel</button>
            </div>
          </form>
          {owners.length === 0 && (
            <p className="text-xs text-amber-600 font-medium mt-4 flex items-center gap-1">
              <UserCheck size={14} /> Note: You must create/promote a user to 'Store Owner' before they appear in this list.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stores.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-3xl shadow-sm border flex justify-between items-start hover:shadow-md transition-all group">
            <div className="flex gap-4">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl h-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Store size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{s.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{s.address}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star size={14} className="fill-current" />
                    {Number(s.overall_rating || 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400 font-bold flex items-center gap-1">
                    <UserCheck size={12} /> Owner: {s.owner_name}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => navigate(`/admin/stores/${s.id}/ratings`)} className="p-2 text-gray-400 hover:text-indigo-600" title="View Ratings"><Eye size={18}/></button>
              <button onClick={() => {setEditingId(s.id); setFormData(s); setShowForm(true)}} className="p-2 text-gray-400 hover:text-indigo-600" title="Edit Store"><Edit size={18}/></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-600" title="Delete Store"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button disabled={filters.page === 1} onClick={() => setFilters({...filters, page: filters.page - 1})} className="p-2 border rounded-xl disabled:opacity-30 hover:bg-white"><ChevronLeft size={20} /></button>
        <span className="text-sm font-bold text-gray-900">Page {pagination.page} of {pagination.totalPages}</span>
        <button disabled={filters.page === pagination.totalPages} onClick={() => setFilters({...filters, page: filters.page + 1})} className="p-2 border rounded-xl disabled:opacity-30 hover:bg-white"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
};

export default StoreManagement;

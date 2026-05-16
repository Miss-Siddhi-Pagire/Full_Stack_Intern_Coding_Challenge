import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, Store, Star, Search, Filter, 
  Trash2, Edit, CheckCircle, XCircle, TrendingUp
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [analytics, setAnalytics] = useState({ trends: [], distribution: [] });
  const [loading, setLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'User' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', owner_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, storesRes, analyticsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/stores'),
        api.get('/admin/analytics')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data.users);
      setStores(storesRes.data.data.stores);
      setAnalytics(analyticsRes.data.data);
    } catch (err) {
      toast.error('Failed to sync dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchData();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      toast.info(`User is now ${newStatus}`);
      fetchData();
    } catch (err) { toast.error('Status update failed'); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/admin/users/${editingItem.id}`, userForm);
        toast.success('User updated');
      } else {
        await api.post('/admin/users', userForm);
        toast.success('User registered');
      }
      setShowUserForm(false);
      setEditingItem(null);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'User' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/admin/stores/${editingItem.id}`, storeForm);
        toast.success('Store updated');
      } else {
        await api.post('/admin/stores', storeForm);
        toast.success('Store created');
      }
      setShowStoreForm(false);
      setEditingItem(null);
      setStoreForm({ name: '', email: '', address: '', owner_id: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-32 bg-gray-200 rounded-3xl"></div>
    <div className="h-96 bg-gray-200 rounded-3xl"></div>
  </div>;

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Hub</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => {setShowUserForm(true); setEditingItem(null)}}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Users size={18} /> Add User
          </button>
          <button 
            onClick={() => {setShowStoreForm(true); setEditingItem(null)}}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Store size={18} /> Add Store
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', val: stats.totalUsers, icon: Users, col: 'indigo' },
          { label: 'Total Stores', val: stats.totalStores, icon: Store, col: 'emerald' },
          { label: 'Total Ratings', val: stats.totalRatings, icon: Star, col: 'amber' }
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700 flex items-center gap-4">
            <div className={`p-4 bg-${s.col}-50 dark:bg-${s.col}-900/20 text-${s.col}-600 rounded-2xl`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              <h3 className="text-2xl font-bold dark:text-white">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
            <TrendingUp size={20} className="text-indigo-600" /> Global Rating Trends
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={analytics.trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="date" tick={{fontSize: 10}} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avg_rating" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
            <Star size={20} className="text-amber-500" /> Rating Distribution
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={analytics.distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Forms (Modals or Expandable) */}
      {(showUserForm || showStoreForm) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl p-8 rounded-3xl shadow-2xl relative">
            <button onClick={() => {setShowUserForm(false); setShowStoreForm(false)}} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {showUserForm ? (editingItem ? 'Edit User' : 'Register User') : (editingItem ? 'Edit Store' : 'Add Store')}
            </h2>
            {showUserForm ? (
              <form onSubmit={handleAddUser} className="space-y-4">
                <input type="text" placeholder="Full Name" required className="w-full p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                <input type="email" placeholder="Email" required className="w-full p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                {!editingItem && <input type="password" placeholder="Password" required className="w-full p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />}
                <select className="w-full p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                  <option value="User">User</option>
                  <option value="Store Owner">Store Owner</option>
                  <option value="Admin">Admin</option>
                </select>
                <textarea placeholder="Address" className="w-full p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} />
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">Save Changes</button>
              </form>
            ) : (
              <form onSubmit={handleAddStore} className="space-y-4">
                <input type="text" placeholder="Store Name" required className="w-full p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} />
                <input type="email" placeholder="Email" required className="w-full p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={storeForm.email} onChange={e => setStoreForm({...storeForm, email: e.target.value})} />
                <input type="number" placeholder="Owner User ID" required className="w-full p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={storeForm.owner_id} onChange={e => setStoreForm({...storeForm, owner_id: e.target.value})} />
                <textarea placeholder="Store Address" className="w-full p-3 border dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} />
                <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold">Save Changes</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold dark:text-white">Platform Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">#{u.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold dark:text-white">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleStatus(u.id, u.status)} className={`flex items-center gap-1 text-xs font-bold ${u.status === 'Active' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {u.status === 'Active' ? <CheckCircle size={14}/> : <XCircle size={14}/>} {u.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => {setEditingItem(u); setUserForm(u); setShowUserForm(true)}} className="p-2 text-gray-400 hover:text-indigo-600"><Edit size={18}/></button>
                      <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

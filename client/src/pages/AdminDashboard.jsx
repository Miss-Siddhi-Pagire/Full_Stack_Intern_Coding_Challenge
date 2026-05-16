import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Store, Star, Filter, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'User' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, storesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/stores')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setStores(storesRes.data.data);
    } catch (err) {
      console.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', userForm);
      setMsg({ type: 'success', text: 'User added successfully!' });
      setShowUserForm(false);
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to add user' });
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stores', storeForm);
      setMsg({ type: 'success', text: 'Store added successfully!' });
      setShowStoreForm(false);
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to add store' });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="AdminPanel" user={currentUser} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Action Buttons & Message */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <button
              onClick={() => {setShowUserForm(!showUserForm); setShowStoreForm(false)}}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center space-x-2 text-sm"
            >
              <Users size={18} />
              <span>{showUserForm ? 'Cancel' : 'Add New User'}</span>
            </button>
            <button
              onClick={() => {setShowStoreForm(!showStoreForm); setShowUserForm(false)}}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center space-x-2 text-sm"
            >
              <Store size={18} />
              <span>{showStoreForm ? 'Cancel' : 'Add New Store'}</span>
            </button>
          </div>
          {msg.text && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium animate-bounce ${msg.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {msg.text}
            </div>
          )}
        </div>

        {/* Add User Form */}
        {showUserForm && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden transition-all duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Create New User Account</h2>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <input type="text" placeholder="Min 20 characters" required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <input type="email" placeholder="email@example.com" required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <input type="password" placeholder="8-16 chars, 1 Upper, 1 Special" required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Role</label>
                <select className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none appearance-none bg-white" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                  <option value="User">Normal User</option>
                  <option value="Admin">System Administrator</option>
                  <option value="Store Owner">Store Owner</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Physical Address</label>
                <textarea placeholder="Full street address..." required rows="2" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} />
              </div>
              <button type="submit" className="md:col-span-2 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">Register Account</button>
            </form>
          </div>
        )}

        {/* Add Store Form */}
        {showStoreForm && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden transition-all duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Register New Store</h2>
            <form onSubmit={handleAddStore} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Name</label>
                <input type="text" placeholder="e.g. Starbucks" required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Email</label>
                <input type="email" placeholder="contact@store.com" required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none" value={storeForm.email} onChange={e => setStoreForm({...storeForm, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Owner ID (User ID)</label>
                <input type="number" placeholder="Enter User ID of Store Owner" required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none" value={storeForm.owner_id} onChange={e => setStoreForm({...storeForm, owner_id: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Address</label>
                <input type="text" placeholder="Full street address..." required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none" value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} />
              </div>
              <button type="submit" className="md:col-span-2 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg">Create Store</button>
            </form>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Store size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Stores</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalStores}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Star size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Ratings</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalRatings}</h3>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Registered Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{user.address}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 
                        user.role === 'Store Owner' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Stores Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Registered Stores</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">Store Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3">Owner</th>
                  <th className="px-6 py-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stores.map(store => (
                  <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{store.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{store.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{store.address}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{store.owner_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star size={16} className="fill-current mr-1" />
                        {Number(store.overall_rating || 0).toFixed(1)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

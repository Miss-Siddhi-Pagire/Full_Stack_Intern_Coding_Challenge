import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, Edit, Trash2, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ name: '', role: '', page: 1 });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', { params: filters });
      setUsers(res.data.data.users);
      setPagination({ page: res.data.data.page, totalPages: res.data.data.totalPages });
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((val) => {
    setFilters(prev => ({ ...prev, name: val, page: 1 }));
  }, 500);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User removed');
      fetchUsers();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleToggleStatus = async (u) => {
    const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.patch(`/admin/users/${u.id}/status`, { status: newStatus });
      toast.info(`User ${u.name} is now ${newStatus}`);
      fetchUsers();
    } catch (err) { toast.error('Update failed'); }
  };

  if (loading && filters.page === 1) return <div className="space-y-4 animate-pulse">{[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-black dark:text-white">User Management</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-9 pr-4 py-2 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none"
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value, page: 1})}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admins</option>
            <option value="User">Normal Users</option>
            <option value="Store Owner">Owners</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">User Details</th>
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
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 
                    u.role === 'Store Owner' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleToggleStatus(u)} className={`flex items-center gap-1 text-xs font-bold ${u.status === 'Active' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {u.status === 'Active' ? <CheckCircle size={14}/> : <XCircle size={14}/>} {u.status}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button 
          disabled={filters.page === 1}
          onClick={() => setFilters({...filters, page: filters.page - 1})}
          className="p-2 border dark:border-gray-700 rounded-xl disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-bold dark:text-white">Page {pagination.page} of {pagination.totalPages}</span>
        <button 
          disabled={filters.page === pagination.totalPages}
          onClick={() => setFilters({...filters, page: filters.page + 1})}
          className="p-2 border dark:border-gray-700 rounded-xl disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default UserManagement;

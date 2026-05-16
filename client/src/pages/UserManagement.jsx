import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, Edit, Trash2, CheckCircle, XCircle, Search, 
  ChevronLeft, ChevronRight, ArrowUpDown, Key, Eye 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ 
    name: '', email: '', address: '', role: '', 
    sortBy: 'id', order: 'asc', page: 1 
  });

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

  const handleSearch = debounce((field, val) => {
    setFilters(prev => ({ ...prev, [field]: val, page: 1 }));
  }, 500);

  const handleSort = (column) => {
    const newOrder = filters.sortBy === column && filters.order === 'asc' ? 'desc' : 'asc';
    setFilters({ ...filters, sortBy: column, order: newOrder, page: 1 });
  };

  const handleResetPassword = async (id) => {
    const newPass = window.prompt('Enter new password for this user:');
    if (!newPass) return;
    try {
      await api.patch(`/admin/users/${id}/reset-password`, { password: newPass });
      toast.success('Password reset successful');
    } catch (err) { toast.error('Reset failed'); }
  };

  const handleToggleStatus = async (u) => {
    const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.patch(`/admin/users/${u.id}/status`, { status: newStatus });
      toast.info(`User ${u.name} is now ${newStatus}`);
      fetchUsers();
    } catch (err) { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User removed');
      fetchUsers();
    } catch (err) { toast.error('Delete failed'); }
  };

  const SortHeader = ({ label, column }) => (
    <th 
      className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {label} <ArrowUpDown size={14} className={filters.sortBy === column ? 'text-indigo-600' : 'text-gray-300'} />
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-black text-gray-900">User Management</h1>
        <div className="flex flex-wrap gap-2">
          <input type="text" placeholder="Name..." className="px-3 py-2 border rounded-xl text-sm" onChange={e => handleSearch('name', e.target.value)} />
          <input type="text" placeholder="Email..." className="px-3 py-2 border rounded-xl text-sm" onChange={e => handleSearch('email', e.target.value)} />
          <input type="text" placeholder="Address..." className="px-3 py-2 border rounded-xl text-sm" onChange={e => handleSearch('address', e.target.value)} />
          <select 
            className="px-3 py-2 border rounded-xl text-sm bg-white"
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value, page: 1})}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">Normal User</option>
            <option value="Store Owner">Store Owner</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b">
            <tr>
              <SortHeader label="ID" column="id" />
              <SortHeader label="Name" column="name" />
              <SortHeader label="Email" column="email" />
              <SortHeader label="Role" column="role" />
              <SortHeader label="Status" column="status" />
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-indigo-600">#{u.id}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
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
                  <div className="flex justify-end gap-1">
                    <button onClick={() => navigate(`/admin/users/${u.id}`)} className="p-2 text-gray-400 hover:text-indigo-600 title='View Details'"><Eye size={18}/></button>
                    <button onClick={() => handleResetPassword(u.id)} className="p-2 text-gray-400 hover:text-amber-600 title='Reset Password'"><Key size={18}/></button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button disabled={filters.page === 1} onClick={() => setFilters({...filters, page: filters.page - 1})} className="p-2 border rounded-xl disabled:opacity-30 hover:bg-white"><ChevronLeft size={20} /></button>
        <span className="text-sm font-bold text-gray-900">Page {pagination.page} of {pagination.totalPages}</span>
        <button disabled={filters.page === pagination.totalPages} onClick={() => setFilters({...filters, page: filters.page + 1})} className="p-2 border rounded-xl disabled:opacity-30 hover:bg-white"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
};

export default UserManagement;

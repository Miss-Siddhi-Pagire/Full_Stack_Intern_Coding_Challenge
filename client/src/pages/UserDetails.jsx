import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, MapPin, Shield, Star, ArrowLeft, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setUser(res.data.data);
      } catch (err) {
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

  if (loading) return <div className="text-center py-20 animate-pulse">Loading user profile...</div>;
  if (!user) return <div className="text-center py-20">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> Back to List
      </button>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-black">
            {user.name[0]}
          </div>
          <div>
            <h1 className="text-3xl font-black">{user.name}</h1>
            <p className="text-indigo-100 flex items-center gap-2 mt-1">
              <Shield size={16} /> {user.role}
            </p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Mail size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Physical Address</p>
                  <p className="text-gray-900 font-medium">{user.address || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Calendar size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Member Since</p>
                  <p className="text-gray-900 font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Platform Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Shield size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Status</p>
                  <span className={`text-xs font-black uppercase px-2 py-1 rounded-lg ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {user.status}
                  </span>
                </div>
              </div>

              {user.role === 'Store Owner' && (
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mt-4">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Store Performance</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-amber-900">{user.storeName || 'N/A'}</p>
                      <p className="text-xs text-amber-700">Average Rating</p>
                    </div>
                    <div className="flex items-center gap-2 text-3xl font-black text-amber-600">
                      <Star className="fill-current" />
                      {Number(user.averageRating || 0).toFixed(1)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

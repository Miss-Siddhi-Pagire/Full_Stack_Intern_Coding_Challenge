import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { User, Mail, MapPin, Save } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfile(res.data.data);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', profile);
      toast.success('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...profile }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Profile Settings</h1>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <input 
              type="text" 
              required
              className="w-full p-3 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            <input 
              type="email" 
              required
              className="w-full p-3 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white"
              value={profile.email}
              onChange={e => setProfile({...profile, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} /> Physical Address
            </label>
            <textarea 
              rows="3"
              className="w-full p-3 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white"
              value={profile.address}
              onChange={e => setProfile({...profile, address: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Lock, ShieldCheck, Key } from 'lucide-react';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    // Validating password strength (8-16 chars, 1 Upper, 1 Special)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(passwords.newPassword)) {
      return toast.error('Password must be 8-16 chars with 1 Uppercase & 1 Special char');
    }

    setLoading(true);
    try {
      await api.put('/user/change-password', { newPassword: passwords.newPassword });
      toast.success('Password changed successfully!');
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border dark:border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-full">
            <ShieldCheck size={40} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2 dark:text-white">Security Update</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Keep your account safe by updating your password regularly.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Key size={14} /> New Password
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full p-3 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              value={passwords.newPassword}
              onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Lock size={14} /> Confirm New Password
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full p-3 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              value={passwords.confirmPassword}
              onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

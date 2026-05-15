import { useState, useEffect } from 'react';
import api from '../services/api';
import { Star, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({ storeName: '', averageRating: 0, totalRatings: 0 });
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const [statsRes, ratingsRes] = await Promise.all([
        api.get('/owner/stats'),
        api.get('/owner/ratings')
      ]);
      setStats(statsRes.data.data);
      setRatings(ratingsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch owner data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="OwnerHub" user={currentUser} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{stats.storeName}</h1>
          <p className="text-gray-500">Overview of your store's performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Average Rating</p>
              <h3 className="text-4xl font-black text-gray-900">{Number(stats.averageRating).toFixed(1)}</h3>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-500">
              <Star size={32} className="fill-current" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Reviewers</p>
              <h3 className="text-4xl font-black text-gray-900">{stats.totalRatings}</h3>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
              <Users size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Recent Ratings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-8 py-4">User Name</th>
                  <th className="px-8 py-4">Email</th>
                  <th className="px-8 py-4 text-center">Rating</th>
                  <th className="px-8 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ratings.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 text-sm font-semibold text-gray-900">{r.user_name}</td>
                    <td className="px-8 py-5 text-sm text-gray-500">{r.user_email}</td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center bg-amber-50 px-3 py-1 rounded-full text-amber-700 font-bold text-sm border border-amber-100">
                        <Star size={14} className="fill-current mr-1" />
                        {r.rating}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-400">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {ratings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-medium">
                      No ratings yet for your store.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;

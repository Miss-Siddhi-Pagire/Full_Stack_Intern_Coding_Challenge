import { useState, useEffect } from 'react';
import api from '../services/api';
import { Star, TrendingUp, Users, Calendar } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { toast } from 'react-toastify';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({ storeName: '', averageRating: 0, totalRatings: 0 });
  const [ratings, setRatings] = useState([]);
  const [analytics, setAnalytics] = useState({ trends: [], distribution: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, ratingsRes, analyticsRes] = await Promise.all([
        api.get('/owner/stats'),
        api.get('/owner/ratings'),
        api.get('/owner/analytics')
      ]);
      setStats(statsRes.data.data);
      setRatings(ratingsRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (err) {
      toast.error('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-8"><div className="h-40 bg-gray-200 rounded-3xl"></div><div className="h-96 bg-gray-200 rounded-3xl"></div></div>;

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{stats.storeName}</h1>
          <p className="text-gray-500">Store Performance Analytics</p>
        </div>
        <div className="bg-indigo-600 px-6 py-3 rounded-2xl text-white shadow-lg flex items-center gap-3">
          <Star className="fill-current" />
          <span className="text-2xl font-bold">{Number(stats.averageRating).toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
            <TrendingUp size={20} className="text-indigo-600" /> Rating Trend (30 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="date" tick={{fontSize: 10}} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="avg_rating" stroke="#4f46e5" strokeWidth={4} dot={{r: 4, fill: '#4f46e5'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Pie */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
            <Users size={20} className="text-emerald-500" /> Rating Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.distribution} dataKey="count" nameKey="rating" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                  {analytics.distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="px-8 py-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Recent Customer Feedback</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Rating</th>
                <th className="px-8 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {ratings.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold dark:text-white">{r.user_name}</div>
                    <div className="text-xs text-gray-500">{r.user_email}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={14} className={idx < r.rating ? 'fill-current' : 'text-gray-200'} />
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {new Date(r.created_at).toLocaleDateString()}
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

export default OwnerDashboard;

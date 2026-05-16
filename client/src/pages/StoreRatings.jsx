import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, ArrowLeft, Calendar, User, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const StoreRatings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingsRes, storesRes] = await Promise.all([
          api.get(`/admin/stores/${id}/ratings`),
          api.get('/admin/stores')
        ]);
        setRatings(ratingsRes.data.data);
        const found = storesRes.data.data.stores.find(s => s.id === parseInt(id));
        setStore(found);
      } catch (err) {
        toast.error('Failed to load ratings');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-20 animate-pulse">Loading ratings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> Back to Stores
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{store?.name}</h1>
          <p className="text-gray-500">{store?.address}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-3xl font-black text-amber-500">
            <Star className="fill-current" />
            {Number(store?.overall_rating || 0).toFixed(1)}
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{ratings.length} Total Ratings</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="px-8 py-6 border-b flex items-center gap-2">
          <MessageSquare className="text-indigo-600" size={20} />
          <h2 className="text-lg font-bold">Rating Log</h2>
        </div>
        <div className="divide-y">
          {ratings.map((r, i) => (
            <div key={i} className="p-8 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                    {r.user_name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{r.user_name}</p>
                    <p className="text-xs text-gray-500">{r.user_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} className={idx < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <Calendar size={14} /> Submitted on {new Date(r.created_at).toLocaleString()}
              </div>
            </div>
          ))}
          {ratings.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-medium italic">
              No ratings submitted for this store yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreRatings;

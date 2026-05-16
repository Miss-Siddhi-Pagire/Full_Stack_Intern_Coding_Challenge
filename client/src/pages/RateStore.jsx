import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, ArrowLeft, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const RateStore = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStore();
  }, [id]);

  const fetchStore = async () => {
    try {
      const response = await api.get('/user/stores');
      const found = response.data.data.stores.find(s => s.id === parseInt(id));
      if (found) {
        setStore(found);
        setRating(found.user_rating || 0);
      }
    } catch (err) {
      toast.error('Could not load store details');
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await api.post('/user/ratings', { store_id: id, rating });
      toast.success('Thank you for your rating!');
      navigate('/user');
    } catch (err) {
      toast.error('Rating submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (!store) return <div className="text-center py-20 animate-pulse">Loading store...</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border dark:border-gray-700 overflow-hidden">
        <div className="bg-emerald-600 p-10 text-white relative text-center overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <MessageSquare size={120} />
          </div>
          <button
            onClick={() => navigate('/user')}
            className="absolute top-6 left-6 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-black mb-2">{store.name}</h2>
          <p className="text-emerald-100 font-medium">{store.address}</p>
        </div>

        <div className="p-10 text-center space-y-8">
          <div>
            <p className="text-gray-600 dark:text-gray-400 font-bold text-lg mb-6 uppercase tracking-widest">
              How was your experience?
            </p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="transition-transform active:scale-90 hover:scale-110"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star
                    size={56}
                    className={`transition-all duration-200 ${
                      star <= (hover || rating) 
                        ? 'fill-amber-400 text-amber-400 drop-shadow-md' 
                        : 'text-gray-200 dark:text-gray-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t dark:border-gray-700">
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-emerald-200 dark:shadow-none shadow-xl hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Submit Feedback</>
              )}
            </button>
            <p className="mt-4 text-xs text-gray-400 font-medium italic">
              Your feedback helps {store.name} improve their service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateStore;

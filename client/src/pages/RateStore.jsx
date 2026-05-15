import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, ArrowLeft } from 'lucide-react';

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
      const found = response.data.data.find(s => s.id === parseInt(id));
      if (found) {
        setStore(found);
        setRating(found.user_rating || 0);
      }
    } catch (err) {
      console.error('Failed to fetch store details');
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await api.post('/ratings', { store_id: id, rating });
      navigate('/user');
    } catch (err) {
      console.error('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  if (!store) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white relative">
          <button
            onClick={() => navigate('/user')}
            className="absolute top-6 left-6 text-indigo-100 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold">{store.name}</h2>
            <p className="text-indigo-100 text-sm mt-1">{store.address}</p>
          </div>
        </div>

        <div className="p-8 text-center">
          <p className="text-gray-600 font-medium mb-6">How was your experience?</p>
          <div className="flex items-center justify-center space-x-2 mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="transition-transform active:scale-90"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={48}
                  className={`transition-colors ${
                    star <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateStore;

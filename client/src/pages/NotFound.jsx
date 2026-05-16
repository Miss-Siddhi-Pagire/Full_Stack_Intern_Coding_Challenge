import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 mb-6">
        <Frown size={64} />
      </div>
      <h1 className="text-6xl font-black text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
      >
        <Home size={20} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;

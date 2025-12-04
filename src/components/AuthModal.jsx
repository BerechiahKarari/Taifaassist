import { useState } from 'react';
import { X, Mail, User as UserIcon, Phone, Globe } from 'lucide-react';

export function AuthModal({ onClose, onSuccess, language }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    language: language || 'en'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Simple login - just check if user exists
        const response = await fetch(`/api/users/${formData.email}`);
        if (response.ok) {
          const user = await response.json();
          onSuccess(user);
        } else {
          setError(language === 'sw' ? 'Mtumiaji hajapatikana' : 'User not found');
        }
      } else {
        // Register new user
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        if (data.success) {
          onSuccess(data.user);
        } else {
          setError(data.error || (language === 'sw' ? 'Usajili umeshindwa' : 'Registration failed'));
        }
      }
    } catch (error) {
      setError(language === 'sw' ? 'Kosa limetokea' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          {isLogin 
            ? (language === 'sw' ? 'Ingia' : 'Sign In')
            : (language === 'sw' ? 'Jisajili' : 'Sign Up')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              {language === 'sw' ? 'Barua pepe' : 'Email'}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  {language === 'sw' ? 'Jina' : 'Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {language === 'sw' ? 'Simu' : 'Phone'} ({language === 'sw' ? 'si lazima' : 'optional'})
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="+254..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  {language === 'sw' ? 'Lugha' : 'Language'}
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                  <option value="sh">Sheng</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
          >
            {loading 
              ? (language === 'sw' ? 'Inasubiri...' : 'Loading...')
              : isLogin 
                ? (language === 'sw' ? 'Ingia' : 'Sign In')
                : (language === 'sw' ? 'Jisajili' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-green-600 hover:text-green-700 dark:text-green-400"
          >
            {isLogin
              ? (language === 'sw' ? 'Huna akaunti? Jisajili' : "Don't have an account? Sign Up")
              : (language === 'sw' ? 'Una akaunti? Ingia' : 'Have an account? Sign In')}
          </button>
        </div>
      </div>
    </div>
  );
}

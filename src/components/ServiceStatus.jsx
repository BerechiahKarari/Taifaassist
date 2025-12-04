import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

export function ServiceStatus({ language }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    fetchServiceStatus();
    const interval = setInterval(fetchServiceStatus, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchServiceStatus = async () => {
    try {
      const response = await fetch('/api/services/status');
      const data = await response.json();
      setServices(data.services);
      setLastChecked(new Date(data.lastChecked));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch service status:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {language === 'sw' ? 'Hali ya Huduma' : 'Service Status'}
        </h3>
        {lastChecked && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lastChecked.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              {service.status === 'online' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{service.name}</p>
                <p className="text-xs text-gray-500">
                  {service.status === 'online'
                    ? (language === 'sw' ? 'Mtandaoni' : 'Online')
                    : (language === 'sw' ? 'Nje ya mtandao' : 'Offline')}
                </p>
              </div>
            </div>
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              title={language === 'sw' ? 'Tembelea tovuti' : 'Visit website'}
            >
              <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </a>
          </div>
        ))}
      </div>

      <button
        onClick={fetchServiceStatus}
        className="w-full mt-3 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
      >
        {language === 'sw' ? 'Sasisha' : 'Refresh'}
      </button>
    </div>
  );
}

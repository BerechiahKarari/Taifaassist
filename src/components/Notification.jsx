import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

export const Notification = ({ type, message, onClose }) => {
  const bgColors = {
    success: "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
    error: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800",
    warning: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
    info: <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${bgColors[type]} mb-2`}>
      {icons[type]}
      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

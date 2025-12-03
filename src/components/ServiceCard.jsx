export const ServiceCard = ({ title, description, icon: Icon, onClick, color = "green" }) => {
  const colorClasses = {
    green: "border-green-200 dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-900/20",
    red: "border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20",
    gray: "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800",
  };

  const iconColors = {
    green: "bg-green-600",
    red: "bg-red-600",
    gray: "bg-black",
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 ${colorClasses[color]} shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <div className={`w-12 h-12 rounded-full ${iconColors[color]} flex items-center justify-center mb-4 mx-auto`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
};

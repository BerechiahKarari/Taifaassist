export const SkeletonLoader = () => (
  <div className="flex justify-start">
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
      </div>
    </div>
  </div>
);

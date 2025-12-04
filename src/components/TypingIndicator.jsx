export function TypingIndicator({ agentName }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-xl p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          {agentName && (
            <span className="text-sm font-semibold">{agentName}</span>
          )}
          <span className="text-sm">is typing</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

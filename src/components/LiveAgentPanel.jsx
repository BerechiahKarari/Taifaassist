import { User, X, Phone, MessageCircle } from 'lucide-react';

export function LiveAgentPanel({ agentName, agentStatus, onDisconnect, language }) {
  const isConnected = agentStatus === 'online';
  
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg shadow-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            {isConnected && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {language === 'sw' ? 'Msaidizi wa Moja kwa Moja' : 'Live Agent'}
            </h3>
            <p className="text-sm opacity-90">{agentName}</p>
            <p className="text-xs opacity-75">
              {agentStatus === 'connecting' 
                ? (language === 'sw' ? 'Inaunganisha...' : 'Connecting...') 
                : (language === 'sw' ? 'Mtandaoni' : 'Online')}
            </p>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          title={language === 'sw' ? 'Maliza mazungumzo' : 'End chat'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3 pt-3 border-t border-white/20 text-xs opacity-75">
        <Phone className="w-3 h-3 inline mr-1" />
        {language === 'sw' 
          ? 'Msaidizi wako atajibu haraka iwezekanavyo' 
          : 'Your agent will respond as quickly as possible'}
      </div>
    </div>
  );
}

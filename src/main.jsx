import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Flag, Sun, Moon, Send, Mic, MicOff, User, Globe, Shield, ArrowLeft } from "lucide-react";
import DOMPurify from 'dompurify';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { translations } from './utils/translations';
import { KenyanFlag } from './components/KenyanFlag';
import { ServiceCard } from './components/ServiceCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import { Notification } from './components/Notification';
import { LiveAgentPanel } from './components/LiveAgentPanel';
import { TypingIndicator } from './components/TypingIndicator';
import { QuickReplies } from './components/QuickReplies';
import { ChatRating } from './components/ChatRating';
import { AuthModal } from './components/AuthModal';
import { FileUpload } from './components/FileUpload';
import { ServiceStatus } from './components/ServiceStatus';
import { AdminDashboard } from './components/AdminDashboard';
import { soundManager } from './utils/sounds';
import { notificationManager } from './utils/notifications';

function App() {
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showLiveAgent, setShowLiveAgent] = useState(false);
  const [agentStatus, setAgentStatus] = useState("offline");
  const [agentName, setAgentName] = useState("");
  const [agentSessionId, setAgentSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showServiceStatus, setShowServiceStatus] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const chatEndRef = useRef(null);
  const { listening, start: startVoice, stop: stopVoice } = useVoiceRecognition();
  const t = translations[language];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Request notification permission on load
    if (notificationsEnabled) {
      notificationManager.requestPermission();
    }
    
    // Load user from localStorage
    const savedUser = localStorage.getItem('taifaassist_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const handleVoiceStart = () => {
    const voiceLang = language === "sw" || language === "sh" ? "sw-KE" : "en-US";
    startVoice(voiceLang, (transcript) => {
      setQuery(transcript);
      const successMsg = language === 'sw' ? "Sauti imetambuliwa" : language === 'sh' ? "Voice imeelewa" : "Voice recognized";
      addNotification('success', successMsg);
    });
  };

  const connectToLiveAgent = async () => {
    setAgentStatus("connecting");
    addNotification('info', language === 'sw' ? 'Inaunganisha na msaidizi...' : 'Connecting to live agent...');

    try {
      const response = await fetch('/api/agent/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: `user_${Date.now()}`, language }),
      });
      const data = await response.json();

      if (data.success) {
        setShowLiveAgent(true);
        setAgentStatus("online");
        setAgentName(data.agentName);
        setAgentSessionId(data.sessionId);
        
        const agentMsg = {
          id: Date.now(),
          text: data.message,
          sender: "agent",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, agentMsg]);
        addNotification('success', language === 'sw' ? `Umeunganishwa na ${data.agentName}` : `Connected to ${data.agentName}`);
        
        // Play sound and show notification
        soundManager.playAgentConnected();
        if (notificationsEnabled) {
          notificationManager.showAgentConnectedNotification(data.agentName, language);
        }
      } else if (data.queued) {
        addNotification('info', language === 'sw' ? `Upo kwenye foleni. Nafasi: ${data.position}` : `You are in queue. Position: ${data.position}`);
        if (notificationsEnabled) {
          notificationManager.showQueueNotification(data.position, language);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setAgentStatus("offline");
      addNotification('error', error.message || (language === 'sw' ? 'Imeshindwa kuunganisha' : 'Failed to connect'));
    }
  };

  const disconnectLiveAgent = async () => {
    if (agentSessionId) {
      try {
        await fetch('/api/agent/disconnect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: agentSessionId }),
        });
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }

    setShowLiveAgent(false);
    setAgentStatus("offline");
    setAgentSessionId(null);
    setShowRating(true);
    
    const disconnectMsg = {
      id: Date.now(),
      text: language === 'sw' ? 'Umeachwa na msaidizi. Msaidizi wa AI sasa upo kukusaidia.' : 'Disconnected from live agent. AI assistant is now available.',
      sender: "system",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, disconnectMsg]);
    addNotification('info', language === 'sw' ? 'Mazungumzo yameisha' : 'Chat ended');
  };

  const handleRatingSubmit = (ratingData) => {
    console.log('Rating submitted:', ratingData);
    addNotification('success', language === 'sw' ? 'Asante kwa maoni yako!' : 'Thank you for your feedback!');
    setTimeout(() => setShowRating(false), 3000);
  };

  const sendMessage = async (messageText) => {
    const textToSend = String(messageText || query || '');
    if (!textToSend.trim()) return;
    const sanitizedQuery = DOMPurify.sanitize(textToSend);
    const newMessage = { 
      id: Date.now(), 
      text: sanitizedQuery, 
      sender: "user", 
      timestamp: new Date().toLocaleTimeString() 
    };
    setMessages(prev => [...prev, newMessage]);
    setQuery("");
    setShowQuickReplies(false);
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      if (showLiveAgent && agentSessionId) {
        const response = await fetch('/api/agent/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: agentSessionId, message: sanitizedQuery }),
        });
        const data = await response.json();
        setIsTyping(false);
        const responseMsg = { 
          id: Date.now() + 1, 
          text: data.response, 
          sender: "agent", 
          timestamp: new Date().toLocaleTimeString() 
        };
        setMessages(prev => [...prev, responseMsg]);
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: sanitizedQuery, language }),
        });
        const data = await response.json();
        setIsTyping(false);
        const responseMsg = { 
          id: Date.now() + 1, 
          text: data.response, 
          sender: "assistant", 
          timestamp: new Date().toLocaleTimeString(),
          showLiveAgentButton: data.suggestLiveAgent
        };
        setMessages(prev => [...prev, responseMsg]);
      }
    } catch (error) {
      setIsTyping(false);
      const fallbackResponse = { 
        id: Date.now() + 1, 
        text: t.defaultResponse(sanitizedQuery), 
        sender: "assistant", 
        timestamp: new Date().toLocaleTimeString() 
      };
      setMessages(prev => [...prev, fallbackResponse]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="fixed top-4 right-4 z-50 w-96 max-w-full">
        {notifications.map(notification => (
          <Notification 
            key={notification.id} 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))} 
          />
        ))}
      </div>

      <div className="h-2 w-full flex">
        <div className="flex-1 bg-black"></div>
        <div className="w-0.5 bg-white"></div>
        <div className="flex-1 bg-red-600"></div>
        <div className="w-0.5 bg-white"></div>
        <div className="flex-1 bg-green-600"></div>
      </div>

      <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          {messages.length > 0 && (
            <button 
              onClick={() => {
                if (showLiveAgent) {
                  disconnectLiveAgent();
                }
                setMessages([]);
              }}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title={language === 'sw' ? 'Rudi nyumbani' : 'Back to home'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <KenyanFlag size="sm" />
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Flag className="w-6 h-6 text-green-400" />
              <span className="bg-gradient-to-r from-white via-red-200 to-green-200 bg-clip-text text-transparent">TaifaAssist</span>
            </h1>
            <p className="text-xs text-gray-300">{t.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-gray-800 px-3 py-2 rounded-lg text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="en">🇬🇧 English</option>
            <option value="sw">🇰🇪 Kiswahili</option>
            <option value="sh">🇰🇪 Sheng</option>
          </select>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-800 rounded-lg">
            {darkMode ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-gray-300" />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        {showLiveAgent && (
          <LiveAgentPanel 
            agentName={agentName} 
            agentStatus={agentStatus} 
            onDisconnect={disconnectLiveAgent}
            language={language}
          />
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mb-8"><KenyanFlag size="xl" /></div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-black via-red-600 to-green-600 bg-clip-text text-transparent dark:from-white dark:via-red-400 dark:to-green-400">{t.karibu}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mb-8 text-lg">
              {language === 'sw' ? "Karibu kwenye mlango wako wa kidijitali kwa Huduma za Serikali ya Kenya. Pata msaada kuhusu vitambulisho, pasipoti, NHIF, KRA, na mengineyo." : "Welcome to your digital gateway for Kenyan Government Services. Get assistance with IDs, passports, NHIF, KRA, and more."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
              <ServiceCard title={t.liveAgent} description={t.talkToAgent} icon={User} onClick={connectToLiveAgent} color="green" />
              <ServiceCard title={t.passportServices} description={t.applyPassport} icon={Globe} onClick={() => setQuery(language === 'sw' ? "Jinsi ya kuomba pasipoti?" : "How to apply for passport?")} color="red" />
              <ServiceCard title={t.kraServices} description={t.taxRegistration} icon={Shield} onClick={() => setQuery(language === 'sw' ? "Usajili wa PIN ya KRA" : "KRA PIN registration")} color="gray" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length > 0 && showQuickReplies && (
              <QuickReplies onSelect={(query) => sendMessage(query)} language={language} />
            )}
            
            {messages.map((msg) => (
              <div key={msg.id}>
                <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xl p-4 rounded-2xl shadow-lg ${
                    msg.sender === "user" ? "bg-green-600 text-white" : 
                    msg.sender === "agent" ? "bg-red-600 text-white" :
                    msg.sender === "system" ? "bg-yellow-100 dark:bg-yellow-900/30 text-gray-800 dark:text-gray-300" :
                    "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                  }`}>
                    {msg.sender === "agent" && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-semibold">{agentName}</span>
                      </div>
                    )}
                    <p>{msg.text}</p>
                    <p className="text-xs mt-2 opacity-75">{msg.timestamp}</p>
                  </div>
                </div>
                {msg.showLiveAgentButton && !showLiveAgent && (
                  <div className="flex justify-start mt-2">
                    <button onClick={connectToLiveAgent} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t.connectAgent}
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && <TypingIndicator agentName={showLiveAgent ? agentName : null} />}
            {isLoading && !isTyping && <SkeletonLoader />}
            
            {showRating && (
              <div className="mt-4">
                <ChatRating onSubmit={handleRatingSubmit} language={language} />
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={showLiveAgent ? (language === 'sw' ? 'Tuma ujumbe kwa msaidizi...' : 'Message live agent...') : t.searchPlaceholder} className="flex-1 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500" />
          {listening ? (
            <button onClick={stopVoice} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"><MicOff className="w-5 h-5 text-red-500" /></button>
          ) : (
            <button onClick={handleVoiceStart} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"><Mic className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
          )}
          <button onClick={sendMessage} disabled={!query.trim() || isLoading} className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 rounded-full">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </footer>

      <div className="p-3 bg-black text-white text-center text-sm border-t-2 border-green-600">
        TaifaAssist © {new Date().getFullYear()} — {t.tagline}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { agentService } from './agentService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Simple AI response logic
const getAIResponse = (message, language) => {
  const lowerMessage = message.toLowerCase();
  
  // Live agent keywords
  const liveAgentKeywords = language === 'sw' 
    ? ["msaidizi", "mtu halisi", "zungumza na mtu", "msaidizi wa moja kwa moja"]
    : ["live agent", "human agent", "speak to person", "talk to human", "real person"];
  
  const suggestLiveAgent = liveAgentKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Service-specific responses
  if (lowerMessage.includes('passport') || lowerMessage.includes('pasipoti')) {
    return {
      response: language === 'sw'
        ? "Kuomba pasipoti, unahitaji: 1) Kitambulisho cha Kitaifa, 2) Cheti cha Kuzaliwa, 3) Picha 2 za pasipoti. Tembelea huduma.go.ke au ofisi ya eCitizen karibu nawe."
        : "To apply for a passport, you need: 1) National ID, 2) Birth Certificate, 3) 2 passport photos. Visit huduma.go.ke or your nearest eCitizen office.",
      suggestLiveAgent: false
    };
  }
  
  if (lowerMessage.includes('kra') || lowerMessage.includes('pin') || lowerMessage.includes('tax')) {
    return {
      response: language === 'sw'
        ? "Kusajili PIN ya KRA: 1) Tembelea itax.kra.go.ke, 2) Chagua 'Register PIN', 3) Jaza fomu na wasilisha. Utapokea PIN ndani ya siku 7."
        : "To register for KRA PIN: 1) Visit itax.kra.go.ke, 2) Select 'Register PIN', 3) Fill the form and submit. You'll receive your PIN within 7 days.",
      suggestLiveAgent: false
    };
  }
  
  if (lowerMessage.includes('nhif')) {
    return {
      response: language === 'sw'
        ? "Kusajili NHIF: 1) Tembelea ofisi ya NHIF na Kitambulisho, 2) Jaza fomu ya usajili, 3) Lipa ada ya usajili. Unaweza pia kusajili mtandaoni kupitia selfcare.nhif.or.ke"
        : "To register for NHIF: 1) Visit NHIF office with your ID, 2) Fill registration form, 3) Pay registration fee. You can also register online at selfcare.nhif.or.ke",
      suggestLiveAgent: false
    };
  }
  
  if (lowerMessage.includes('id') || lowerMessage.includes('kitambulisho')) {
    return {
      response: language === 'sw'
        ? "Kuomba Kitambulisho cha Kitaifa: 1) Umri lazima uwe miaka 18+, 2) Pata fomu kutoka ofisi ya chief, 3) Wasilisha na cheti cha kuzaliwa na picha. Tembelea huduma.go.ke kwa maelezo zaidi."
        : "To apply for National ID: 1) Must be 18+ years, 2) Get form from chief's office, 3) Submit with birth certificate and photo. Visit huduma.go.ke for more details.",
      suggestLiveAgent: false
    };
  }
  
  // Default response
  return {
    response: language === 'sw'
      ? `Ninaelewa unauliza kuhusu "${message}". Je, ungependa maelezo zaidi kuhusu huduma hii? Ninaweza kukusaidia na Pasipoti, KRA PIN, NHIF, Kitambulisho, na huduma nyingine za serikali.`
      : `I understand you're asking about "${message}". Would you like more details about this service? I can help with Passports, KRA PIN, NHIF, National ID, and other government services.`,
    suggestLiveAgent
  };
};

// Chat endpoint
app.post('/api/chat', (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const aiResponse = getAIResponse(message, language);
    
    // Simulate processing delay
    setTimeout(() => {
      res.json(aiResponse);
    }, 500);
    
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Live agent endpoints
app.post('/api/agent/connect', (req, res) => {
  try {
    const { userId, language = 'en' } = req.body;
    const session = agentService.createSession(userId || `user_${Date.now()}`, language);
    
    if (!session) {
      return res.status(503).json({ 
        error: language === 'sw' ? 'Wasaidizi wote wameshughulika. Tafadhali jaribu tena baadaye.' : 'All agents are busy. Please try again later.' 
      });
    }
    
    res.json({
      success: true,
      sessionId: session.sessionId,
      agentName: session.agentName,
      message: language === 'sw' 
        ? `Habari! Mimi ni ${session.agentName}, msaidizi wako. Ninaweza kukusaidia vipi leo?`
        : `Hello! I'm ${session.agentName}, your support agent. How can I assist you today?`
    });
  } catch (error) {
    console.error('Agent connect error:', error);
    res.status(500).json({ error: 'Failed to connect to agent' });
  }
});

app.post('/api/agent/message', (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const response = agentService.getAgentResponse(sessionId, message);
    
    if (!response) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Simulate typing delay
    setTimeout(() => {
      res.json({ response, timestamp: new Date().toISOString() });
    }, 1000 + Math.random() * 2000);
  } catch (error) {
    console.error('Agent message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.post('/api/agent/disconnect', (req, res) => {
  try {
    const { sessionId } = req.body;
    const success = agentService.endSession(sessionId);
    res.json({ success });
  } catch (error) {
    console.error('Agent disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    availableAgents: agentService.agents.filter(a => a.status === 'available').length
  });
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 TaifaAssist Backend running on http://localhost:${PORT}`);
  console.log(`📞 Live Agent Service: ${agentService.agents.length} agents available`);
});

// Live agent service simulation
export class AgentService {
  constructor() {
    this.sessions = new Map();
    this.agents = [
      { id: 1, name: 'Elizabeth Mafi', status: 'available', language: ['en', 'sw', 'sh'] },
      { id: 2, name: 'Kim Ted', status: 'available', language: ['en', 'sw', 'sh'] },
      { id: 3, name: 'Grace Nyaguthii', status: 'available', language: ['en', 'sw', 'sh'] },
      { id: 4, name: 'John Kamau', status: 'available', language: ['en', 'sw', 'sh'] },
      { id: 5, name: 'Mary Wanjiku', status: 'available', language: ['en', 'sw', 'sh'] },
      { id: 6, name: 'David Omondi', status: 'available', language: ['en', 'sw', 'sh'] },
      { id: 7, name: 'Sarah Akinyi', status: 'available', language: ['en', 'sw', 'sh'] },
      { id: 8, name: 'Peter Mwangi', status: 'available', language: ['en', 'sw', 'sh'] },
    ];
    
    // Auto-cleanup stale sessions every 5 minutes
    setInterval(() => this.cleanupStaleSessions(), 5 * 60 * 1000);
  }
  
  cleanupStaleSessions() {
    const now = Date.now();
    const maxSessionAge = 30 * 60 * 1000; // 30 minutes
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.startTime.getTime() > maxSessionAge) {
        console.log(`Cleaning up stale session: ${sessionId}`);
        this.endSession(sessionId);
      }
    }
  }

  findAvailableAgent(language) {
    return this.agents.find(agent => 
      agent.status === 'available' && agent.language.includes(language)
    );
  }

  createSession(userId, language) {
    const agent = this.findAvailableAgent(language);
    if (!agent) return null;

    const sessionId = `session_${Date.now()}`;
    agent.status = 'busy';
    
    this.sessions.set(sessionId, {
      userId,
      agentId: agent.id,
      agentName: agent.name,
      language,
      startTime: new Date(),
      messages: []
    });

    return { sessionId, agentName: agent.name, agentId: agent.id };
  }

  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      const agent = this.agents.find(a => a.id === session.agentId);
      if (agent) agent.status = 'available';
      this.sessions.delete(sessionId);
      return true;
    }
    return false;
  }

  getAgentResponse(sessionId, userMessage) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Simulate agent typing and response
    const responses = {
      en: [
        "I understand your concern. Let me help you with that.",
        "That's a great question. Here's what you need to know...",
        "I can definitely assist you with this process.",
        "Let me check that information for you right away.",
      ],
      sw: [
        "Ninaelewa wasiwasi wako. Nisaidie kwa hilo.",
        "Hilo ni swali nzuri. Hapa kuna unachohitaji kujua...",
        "Naweza kukusaidia na mchakato huu.",
        "Niangalie taarifa hiyo kwa ajili yako mara moja.",
      ],
      sh: [
        "Sawa msee, nimeelewa shida yako. Nisaidie na hiyo.",
        "Hiyo ni swali poa sana. Hapa kuna chenye unahitaji kujua...",
        "Naweza kukusort na hii process kabisa.",
        "Niangalie hiyo info kwa ajili yako haraka sana.",
      ]
    };

    const langResponses = responses[session.language] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  }
}

export const agentService = new AgentService();

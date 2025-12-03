// Live agent service simulation
export class AgentService {
  constructor() {
    this.sessions = new Map();
    this.userAgentHistory = new Map(); // Track which agents users have talked to
    this.lastAssignedIndex = 0; // Round-robin assignment
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

  findAvailableAgent(language, userId) {
    // Get list of agents this user has already talked to
    const userHistory = this.userAgentHistory.get(userId) || [];
    
    // Filter available agents that support the language
    const availableAgents = this.agents.filter(agent => 
      agent.status === 'available' && agent.language.includes(language)
    );
    
    if (availableAgents.length === 0) return null;
    
    // Try to find an agent the user hasn't talked to yet
    let newAgent = availableAgents.find(agent => !userHistory.includes(agent.id));
    
    // If user has talked to all agents, reset their history and use round-robin
    if (!newAgent) {
      this.userAgentHistory.set(userId, []);
      this.lastAssignedIndex = (this.lastAssignedIndex + 1) % availableAgents.length;
      newAgent = availableAgents[this.lastAssignedIndex];
    }
    
    return newAgent;
  }

  createSession(userId, language) {
    const agent = this.findAvailableAgent(language, userId);
    if (!agent) return null;

    const sessionId = `session_${Date.now()}`;
    agent.status = 'busy';
    
    // Track that this user talked to this agent
    const userHistory = this.userAgentHistory.get(userId) || [];
    userHistory.push(agent.id);
    this.userAgentHistory.set(userId, userHistory);
    
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

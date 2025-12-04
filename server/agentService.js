// Live agent service simulation - optimized for high load
export class AgentService {
  constructor() {
    this.sessions = new Map();
    this.userAgentHistory = new Map(); // Track which agents users have talked to
    this.lastAssignedIndex = 0; // Round-robin assignment
    this.queuedUsers = []; // Queue for when all agents are busy
    this.maxConcurrentSessions = 15; // Each agent can handle up to 2 sessions
    this.agents = [
      { id: 1, name: 'Elizabeth Burudi', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
      { id: 2, name: 'Kim Ted', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
      { id: 3, name: 'Grace Nyaguthii', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
      { id: 4, name: 'John Kamau', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
      { id: 5, name: 'Mary Wanjiku', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
      { id: 6, name: 'David Omondi', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
      { id: 7, name: 'Sarah Akinyi', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
      { id: 8, name: 'Peter Mwangi', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
      { id: 9, name: 'James Otieno', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
      { id: 10, name: 'Lucy Njeri', status: 'available', language: ['en', 'sw', 'sh'], activeSessions: 0, maxSessions: 2 },
    ];
    
    // Auto-cleanup stale sessions every 3 minutes (more frequent)
    setInterval(() => this.cleanupStaleSessions(), 3 * 60 * 1000);
    
    // Process queue every 10 seconds
    setInterval(() => this.processQueue(), 10 * 1000);
    
    // Log stats every minute
    setInterval(() => this.logStats(), 60 * 1000);
  }
  
  logStats() {
    const activeAgents = this.agents.filter(a => a.activeSessions > 0).length;
    const totalSessions = this.agents.reduce((sum, a) => sum + a.activeSessions, 0);
    const queueSize = this.queuedUsers.length;
    console.log(`📊 Stats: ${activeAgents}/${this.agents.length} agents active, ${totalSessions} sessions, ${queueSize} queued`);
  }
  
  processQueue() {
    if (this.queuedUsers.length === 0) return;
    
    console.log(`Processing queue: ${this.queuedUsers.length} users waiting`);
    const processedUsers = [];
    
    for (const queuedUser of this.queuedUsers) {
      const agent = this.findAvailableAgent(queuedUser.language, queuedUser.userId);
      if (agent) {
        const session = this.createSessionWithAgent(agent, queuedUser.userId, queuedUser.language);
        if (session && queuedUser.callback) {
          queuedUser.callback(session);
        }
        processedUsers.push(queuedUser);
      }
    }
    
    // Remove processed users from queue
    this.queuedUsers = this.queuedUsers.filter(u => !processedUsers.includes(u));
  }
  
  cleanupStaleSessions() {
    const now = Date.now();
    const maxSessionAge = 20 * 60 * 1000; // 20 minutes (reduced from 30)
    const inactiveTimeout = 5 * 60 * 1000; // 5 minutes of inactivity
    
    let cleanedCount = 0;
    for (const [sessionId, session] of this.sessions.entries()) {
      const sessionAge = now - session.startTime.getTime();
      const lastActivity = session.lastActivity || session.startTime.getTime();
      const inactiveTime = now - lastActivity;
      
      if (sessionAge > maxSessionAge || inactiveTime > inactiveTimeout) {
        console.log(`🧹 Cleaning up stale session: ${sessionId} (age: ${Math.floor(sessionAge/60000)}min, inactive: ${Math.floor(inactiveTime/60000)}min)`);
        this.endSession(sessionId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`✅ Cleaned ${cleanedCount} stale sessions`);
    }
  }

  findAvailableAgent(language, userId) {
    // Get list of agents this user has already talked to
    const userHistory = this.userAgentHistory.get(userId) || [];
    
    // Filter agents that can take more sessions and support the language
    const availableAgents = this.agents.filter(agent => 
      agent.activeSessions < agent.maxSessions && agent.language.includes(language)
    ).sort((a, b) => a.activeSessions - b.activeSessions); // Prioritize less busy agents
    
    if (availableAgents.length === 0) return null;
    
    // Try to find an agent the user hasn't talked to yet
    let newAgent = availableAgents.find(agent => !userHistory.includes(agent.id));
    
    // If user has talked to all available agents, use the least busy one
    if (!newAgent) {
      newAgent = availableAgents[0]; // Already sorted by activeSessions
    }
    
    return newAgent;
  }

  createSessionWithAgent(agent, userId, language) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    agent.activeSessions++;
    
    // Update status based on load
    if (agent.activeSessions >= agent.maxSessions) {
      agent.status = 'busy';
    } else {
      agent.status = 'available';
    }
    
    // Track that this user talked to this agent
    const userHistory = this.userAgentHistory.get(userId) || [];
    if (!userHistory.includes(agent.id)) {
      userHistory.push(agent.id);
      this.userAgentHistory.set(userId, userHistory);
    }
    
    this.sessions.set(sessionId, {
      userId,
      agentId: agent.id,
      agentName: agent.name,
      language,
      startTime: new Date(),
      lastActivity: new Date(),
      messages: []
    });

    console.log(`✅ Session created: ${agent.name} (${agent.activeSessions}/${agent.maxSessions} sessions)`);
    return { sessionId, agentName: agent.name, agentId: agent.id };
  }

  createSession(userId, language) {
    const agent = this.findAvailableAgent(language, userId);
    
    if (!agent) {
      // Add to queue if all agents are busy
      console.log(`⏳ All agents busy, queueing user ${userId}`);
      return { queued: true, position: this.queuedUsers.length + 1 };
    }

    return this.createSessionWithAgent(agent, userId, language);
  }

  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      const agent = this.agents.find(a => a.id === session.agentId);
      if (agent) {
        agent.activeSessions = Math.max(0, agent.activeSessions - 1);
        agent.status = agent.activeSessions < agent.maxSessions ? 'available' : 'busy';
        console.log(`👋 Session ended: ${agent.name} (${agent.activeSessions}/${agent.maxSessions} sessions)`);
      }
      this.sessions.delete(sessionId);
      
      // Process queue after freeing up an agent
      setTimeout(() => this.processQueue(), 100);
      return true;
    }
    return false;
  }

  getAgentResponse(sessionId, userMessage) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Update last activity timestamp
    session.lastActivity = new Date();
    session.messages.push({ sender: 'user', text: userMessage, timestamp: new Date() });

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

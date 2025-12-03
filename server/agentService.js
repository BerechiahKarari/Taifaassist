// Live agent service simulation
export class AgentService {
  constructor() {
    this.sessions = new Map();
    this.agents = [
      { id: 1, name: 'Elizabeth Mafi', status: 'available', language: ['en', 'sw', 'sh'] },
      { id: 2, name: 'Kim Ted', status: 'available', language: ['en', 'sw', 'sh'] },
      { id: 3, name: 'Grace Nyaguthii', status: 'available', language: ['en', 'sw', 'sh'] },
    ];
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

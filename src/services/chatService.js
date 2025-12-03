// Enhanced chat service with better AI responses
export const chatService = {
  async sendMessage(message, language) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language }),
      });
      return await response.json();
    } catch (error) {
      console.error('Chat error:', error);
      return null;
    }
  },

  async connectToAgent(userId, language) {
    try {
      const response = await fetch('/api/agent/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, language }),
      });
      return await response.json();
    } catch (error) {
      console.error('Agent connection error:', error);
      return null;
    }
  },

  async disconnectAgent(sessionId) {
    try {
      await fetch('/api/agent/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch (error) {
      console.error('Agent disconnect error:', error);
    }
  }
};

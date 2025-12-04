// Simple in-memory database (will upgrade to real DB later)
// For production, replace with MongoDB, PostgreSQL, or Supabase

class Database {
  constructor() {
    this.users = new Map();
    this.chatHistory = new Map();
    this.ratings = [];
    this.appointments = new Map();
    this.uploads = new Map();
    this.analytics = {
      totalChats: 0,
      totalUsers: 0,
      avgRating: 0,
      popularServices: {}
    };
  }

  // User Management
  createUser(userData) {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      createdAt: new Date(),
      lastLogin: new Date(),
      preferences: {
        language: userData.language || 'en',
        notifications: true
      }
    };
    this.users.set(userId, user);
    this.analytics.totalUsers++;
    return user;
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  updateUser(userId, updates) {
    const user = this.users.get(userId);
    if (user) {
      Object.assign(user, updates);
      return user;
    }
    return null;
  }

  // Chat History
  saveChatMessage(userId, sessionId, message) {
    const key = `${userId}_${sessionId}`;
    if (!this.chatHistory.has(key)) {
      this.chatHistory.set(key, []);
    }
    const chat = this.chatHistory.get(key);
    chat.push({
      ...message,
      timestamp: new Date()
    });
    this.analytics.totalChats++;
    return true;
  }

  getChatHistory(userId, limit = 50) {
    const userChats = [];
    for (const [key, messages] of this.chatHistory.entries()) {
      if (key.startsWith(userId)) {
        userChats.push(...messages);
      }
    }
    return userChats.slice(-limit);
  }

  searchChats(userId, query) {
    const history = this.getChatHistory(userId, 1000);
    return history.filter(msg => 
      msg.text.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Ratings
  saveRating(ratingData) {
    const rating = {
      id: `rating_${Date.now()}`,
      ...ratingData,
      timestamp: new Date()
    };
    this.ratings.push(rating);
    
    // Update average rating
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.analytics.avgRating = sum / this.ratings.length;
    
    return rating;
  }

  getAgentRatings(agentId) {
    return this.ratings.filter(r => r.agentId === agentId);
  }

  // Appointments
  createAppointment(appointmentData) {
    const appointmentId = `appt_${Date.now()}`;
    const appointment = {
      id: appointmentId,
      ...appointmentData,
      status: 'pending',
      createdAt: new Date()
    };
    this.appointments.set(appointmentId, appointment);
    return appointment;
  }

  getUserAppointments(userId) {
    const userAppointments = [];
    for (const [id, appt] of this.appointments.entries()) {
      if (appt.userId === userId) {
        userAppointments.push(appt);
      }
    }
    return userAppointments.sort((a, b) => b.createdAt - a.createdAt);
  }

  updateAppointment(appointmentId, updates) {
    const appointment = this.appointments.get(appointmentId);
    if (appointment) {
      Object.assign(appointment, updates);
      return appointment;
    }
    return null;
  }

  // File Uploads
  saveUpload(uploadData) {
    const uploadId = `upload_${Date.now()}`;
    const upload = {
      id: uploadId,
      ...uploadData,
      uploadedAt: new Date()
    };
    this.uploads.set(uploadId, upload);
    return upload;
  }

  getUserUploads(userId) {
    const userUploads = [];
    for (const [id, upload] of this.uploads.entries()) {
      if (upload.userId === userId) {
        userUploads.push(upload);
      }
    }
    return userUploads;
  }

  // Analytics
  getAnalytics() {
    return {
      ...this.analytics,
      totalRatings: this.ratings.length,
      totalAppointments: this.appointments.size,
      totalUploads: this.uploads.size,
      recentActivity: this.getRecentActivity()
    };
  }

  getRecentActivity(limit = 10) {
    const activities = [];
    
    // Recent chats
    for (const [key, messages] of this.chatHistory.entries()) {
      if (messages.length > 0) {
        activities.push({
          type: 'chat',
          timestamp: messages[messages.length - 1].timestamp,
          data: messages[messages.length - 1]
        });
      }
    }
    
    // Recent ratings
    this.ratings.forEach(rating => {
      activities.push({
        type: 'rating',
        timestamp: rating.timestamp,
        data: rating
      });
    });
    
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  trackServiceUsage(service) {
    if (!this.analytics.popularServices[service]) {
      this.analytics.popularServices[service] = 0;
    }
    this.analytics.popularServices[service]++;
  }
}

export const db = new Database();

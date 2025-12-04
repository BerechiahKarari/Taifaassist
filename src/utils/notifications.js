// Push notification utilities

class NotificationManager {
  constructor() {
    this.permission = 'default';
    this.checkPermission();
  }

  checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      tag: 'taifaassist',
      requireInteraction: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) {
          options.onClick();
        }
      };

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);
      
      return notification;
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  showMessageNotification(agentName, message, language = 'en') {
    const title = language === 'sw' 
      ? `Ujumbe mpya kutoka ${agentName}`
      : `New message from ${agentName}`;
    
    this.showNotification(title, {
      body: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      icon: '/favicon.ico'
    });
  }

  showAgentConnectedNotification(agentName, language = 'en') {
    const title = language === 'sw'
      ? 'Umeunganishwa na msaidizi'
      : 'Connected to live agent';
    
    const body = language === 'sw'
      ? `${agentName} sasa yupo kukusaidia`
      : `${agentName} is now available to help you`;
    
    this.showNotification(title, { body });
  }

  showQueueNotification(position, language = 'en') {
    const title = language === 'sw'
      ? 'Upo kwenye foleni'
      : 'You are in queue';
    
    const body = language === 'sw'
      ? `Nafasi yako: ${position}. Tutakuunganisha na msaidizi hivi karibuni.`
      : `Position: ${position}. We'll connect you to an agent shortly.`;
    
    this.showNotification(title, { body });
  }
}

export const notificationManager = new NotificationManager();

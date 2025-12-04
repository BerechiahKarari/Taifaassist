// Sound notification utilities

class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.5;
  }

  // Create audio context for sound generation
  playNotification() {
    if (!this.enabled) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  }

  playMessageReceived() {
    if (!this.enabled) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Two-tone notification
      [600, 800].forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime + (index * 0.15);
        gainNode.gain.setValueAtTime(this.volume * 0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
      });
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  }

  playAgentConnected() {
    if (!this.enabled) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Success sound - ascending tones
      [400, 500, 600].forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime + (index * 0.1);
        gainNode.gain.setValueAtTime(this.volume * 0.4, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
      });
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();

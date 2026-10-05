/**
 * Sound synthesis engine using Web Audio API and Speech Synthesis
 * Pure browser implementation: 0 external audio dependencies, instant & reliable!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voiceEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  public isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  /**
   * Cheerful button pop / bubble tap
   */
  public playPop() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Correct Answer Chime - Pentatonic cheerful progression
   */
  public playSuccess() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const startTime = ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch {
      // silent
    }
  }

  /**
   * Gentle encouraging sound on wrong answer (never scary or harsh!)
   */
  public playGentleTryAgain() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [349.23, 293.66]; // F4, D4 soft warm chime
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const startTime = ctx.currentTime + idx * 0.12;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    } catch {
      // silent
    }
  }

  /**
   * Star Pop Chime (higher pitch per star)
   */
  public playStarPop(index: number = 0) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const pitches = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
      const freq = pitches[index % pitches.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // silent
    }
  }

  /**
   * Fanfare for completing an entire stage or world
   */
  public playFanfare() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const chords = [
        { freqs: [523.25, 659.25, 783.99], time: 0.0, dur: 0.2 },
        { freqs: [587.33, 739.99, 880.0], time: 0.22, dur: 0.2 },
        { freqs: [659.25, 830.61, 987.77], time: 0.44, dur: 0.25 },
        { freqs: [783.99, 987.77, 1046.5, 1318.51], time: 0.72, dur: 0.9 },
      ];

      chords.forEach(({ freqs, time, dur }) => {
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + time;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + dur + 0.05);
        });
      });
    } catch {
      // silent
    }
  }

  /**
   * Card flip sound
   */
  public playCardFlip() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // silent
    }
  }

  /**
   * Sticker place stamp
   */
  public playStickerStamp() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // silent
    }
  }

  /**
   * Speak Arabic text for young children using SpeechSynthesis
   */
  public speakArabic(text: string) {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.92; // Slightly slower, very clear for kids
      utterance.pitch = 1.15; // Cheerful friendly pitch

      // Pick an Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic')
      );
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech fallback
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sound = new SoundEngine();

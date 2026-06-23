// Browser-native procedural synthesizer using Web Audio API
// Custom engineered for the Aether-Synthesizer HUD console

let audioCtx: AudioContext | null = null;
let holdsAmbientNode: OscillatorNode | null = null;
let holdsAmbientGain: GainNode | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    } catch (err) {
      console.warn("Failed to create AudioContext in sandbox:", err);
      return null;
    }
  }
  return audioCtx;
}

// Utility to play generic high-fidelity blips
export function playBlip(frequency = 800, duration = 0.08, type: OscillatorType = "sine") {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Quick pitch decay for high-tech "blip"
    osc.frequency.exponentialRampToValueAtTime(frequency / 2, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn("Web Audio failed to play sound:", err);
  }
}

// Crisp modern terminal tick sound
export function playTick() {
  playBlip(1200, 0.03, "sine");
}

// Sweep sound for successful strategy syntheses and Win Inspects
export function playWinSweep() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = "sine";
    osc2.type = "triangle";

    // Play high harmonic chord sweeping upwards
    osc1.frequency.setValueAtTime(320, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + 0.35);

    osc2.frequency.setValueAtTime(480, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1440, ctx.currentTime + 0.35);

    filter.type = "lowpass";
    filter.Q.setValueAtTime(10, ctx.currentTime);
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.35);

    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.35);
  } catch (err) {
    console.warn("Web Audio Sweep error:", err);
  }
}

// Low frequency sweeps for loss diagnostics
export function playLossSweep() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.4);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (err) {
    console.warn("Web Audio Loss error:", err);
  }
}

// Play modular synthesis arpeggio when processing strategy
export function playArpeggioSequence() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const notes = [440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    
    // Play 5 quick structural synthesis pings
    for (let i = 0; i < 5; i++) {
      const time = now + i * 0.095;
      const freq = notes[Math.floor(Math.random() * notes.length)];
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, time + 0.08);

      gainNode.gain.setValueAtTime(0.05, time);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.08);
    }
  } catch (err) {
    console.warn("Web Audio sequence failed:", err);
  }
}

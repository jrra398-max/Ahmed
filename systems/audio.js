export class AudioSystem {
  constructor() {
    this.enabled = true;
  }

  setEnabled(value) {
    this.enabled = value;
  }

  playSFX(name) {
    if (!this.enabled) return;
  }
}

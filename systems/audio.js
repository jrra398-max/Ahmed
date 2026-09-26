export class AudioSystem{constructor(){this.enabled=true}setEnabled(v){this.enabled=v}playSFX(name){if(!this.enabled)return;/* Hook WebAudio/SFX assets here. */}}

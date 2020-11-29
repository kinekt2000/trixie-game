export default class MusicPlayer {
    constructor() {
        this.tracks = new Map();
    }

    addTrack(name, url, volume = 1) {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = volume;
        this.tracks.set(name, audio)
    }

    playTrack(name, overlay = true) {
        if(overlay) {
            this.pauseAll();
        }

        const audio = this.tracks.get(name);
        audio.play();
        return audio;
    }

    pauseAll() {
        for(const audio of this.tracks.values()) {
            audio.pause();
        }
    }
}

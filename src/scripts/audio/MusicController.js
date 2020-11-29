export default class MusicController {
    constructor() {
        this.player = null;
    }

    /**
     *
     * @param {MusicPlayer} player
     */
    setPlayer(player) {
        this.player = player;
    }

    playTheme(speed = 1) {
        const audio = this.player.playTrack('main', true);
        audio.playbackRate = speed;
    }

    playHurryTheme() {
        this.playTheme(1.3);
        const audio = this.player.playTrack("thunder", false);
        audio.loop = false;
    }

    playLevelCompleteTheme() {
        const audio = this.player.playTrack("levelComplete", true);
        audio.loop = false;
    }

    playGameCompleteTheme() {
        const audio = this.player.playTrack("gameComplete", true);
    }

    playGameOverTheme() {
        const audio = this.player.playTrack("gameOver", true);
    }

    pause() {
        this.player.pauseAll();
    }

}

import {loadJSON} from "@/util/loaders";
import MusicPlayer from "@/audio/MusicPlayer";

export function loadMusicSheet(name) {
    return loadJSON(`/assets/music/${name}.json`)
        .then(music_spec => {
            const musicPlayer = new MusicPlayer();
            Object.entries(music_spec).forEach(([name, track]) => {
                musicPlayer.addTrack(name, track.url, track.volume)
            })
            return musicPlayer;
        })
}

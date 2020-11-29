import {createAudioLoader, loadJSON} from "@/util/loaders";
import AudioBoard from "@/audio/AudioBoard";

export function loadAudioBoard(name, audio_context) {
    const loadAudio = createAudioLoader(audio_context);
    return loadJSON(`/assets/sounds/${name}.json`)
        .then(audio_spec => {
            const audioBoard = new AudioBoard(audio_context);
            const fx = audio_spec.fx;
            const jobs = []
            Object.keys(fx).forEach(name => {
                const url = fx[name].url;
                const job = loadAudio(url).then(buffer => {
                    audioBoard.addAudio(name, buffer);
                })
                jobs.push(job);
            })

            return Promise.all(jobs).then(() => audioBoard);
        })
}

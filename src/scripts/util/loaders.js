export function createAudioLoader(audio_context) {
    return function loadAudio(url) {
        return fetch(url)
            .then(response => {
                return response.arrayBuffer();
            })
            .then(array_buffer => {
                return audio_context.decodeAudioData(array_buffer);
            })
    }
}

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image)
        })
        image.src = url;
    })
}

export function loadJSON(url) {
    return fetch(url).then(r => r.json());
}







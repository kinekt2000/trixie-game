export function createAnimation(frames, frame_length, repeat = true) {
    const all_frames_distance = frame_length * frames.length
    const last_frame = frames[frames.length - 1];
    return function resolveFrame(distance) {
        const frameIndex = Math.floor(distance / frame_length) % frames.length;

        // if(!repeat)

        if(repeat) {
            return frames[frameIndex];
        } else if (distance / all_frames_distance > 1) {
            return last_frame;
        } else {
            return frames[frameIndex];
        }
    }
}

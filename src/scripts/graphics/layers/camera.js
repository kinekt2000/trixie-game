import {Vector2} from "@/util/math";

export function createCameraLayer(cameraToDraw) {
    return function drawCamera(context, camera) {
        const scaleFactor = new Vector2(
            context.canvas.width / camera.size.x,
            context.canvas.height / camera.size.y
        )

        context.strokeStyle = 'magenta'
        context.beginPath();
        context.rect(
            (cameraToDraw.pos.x - camera.pos.x) * scaleFactor.x,
            (cameraToDraw.pos.y - camera.pos.y) * scaleFactor.y,
            cameraToDraw.size.x * scaleFactor.x,
            cameraToDraw.size.y * scaleFactor.y
        )
        context.stroke();
    }
}

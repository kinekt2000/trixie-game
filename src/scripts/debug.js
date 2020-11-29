import {scale} from "@/util/math";

export function setupMouseControl(canvas, entity, camera) {
    let lastEvent;
    let lastEventX;
    let lastEventY;

    ['mousedown', 'mousemove'].forEach(eventName => {
        canvas.addEventListener(eventName, event => {
            if(event.buttons === 1) {
                // noinspection JSSuspiciousNameCombination
                const posX = scale(event.offsetX, 0, canvas.width, 0, camera.size.x)
                // noinspection JSSuspiciousNameCombination
                const posY = scale(event.offsetY, 0, canvas.height, 0, camera.size.y)
                entity.vel.set(0, 0);
                entity.pos.set(posX + camera.pos.x, posY + camera.pos.y);
            } else if (event.buttons === 2 && lastEvent && lastEvent.buttons === 2 && lastEvent.type === 'mousemove') {
                const diffX = event.offsetX - lastEventX
                // noinspection JSSuspiciousNameCombination
                let cameraDiffX = scale(diffX, 0, canvas.width, 0, camera.size.x);
                cameraDiffX = cameraDiffX < 0 ? Math.floor(cameraDiffX) : Math.ceil(cameraDiffX)

                camera.pos.x -= cameraDiffX;

            }
            lastEvent = event;
            lastEventX = event.offsetX;
            lastEventY = event.offsetY;
        })
    })

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
    })
}

import {Vector2} from "@/util/math";
/**
 *
 * @param {Set<Entity>} entities
 * @param {number} width
 * @param {number} height
 * @return {function (CanvasRenderingContext2D, Camera)}
 */
export function createDynamicLayer(entities, width, height) {
    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;

    const bufferContext = buffer.getContext('2d');

    return function (context, camera) {
        context.imageSmoothingEnabled       = false;
        entities.forEach(entity => {
            bufferContext.clearRect(0, 0, width, height);

            const drawnSize = entity.draw(bufferContext);
            if(drawnSize === undefined) return;

            const gamePosition = new Vector2(
                (entity.heading === 1 ? entity.bounds.left : (entity.bounds.right - drawnSize.x))  - camera.pos.x,
                entity.pos.y - camera.pos.y
            )

            const scaleFactor = new Vector2(
                context.canvas.width / camera.size.x,
                context.canvas.height / camera.size.y
            )

            const screenPosition = new Vector2(
                gamePosition.x * scaleFactor.x,
                gamePosition.y * scaleFactor.y
            )

            context.drawImage(
                buffer,
                screenPosition.x,
                screenPosition.y,
                width * scaleFactor.x,
                height * scaleFactor.y
            )
        })
    }
}

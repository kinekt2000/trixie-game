import {Vector2} from "@/util/math";

function createEntityLayer(entities) {
    return function drawBoundingBoxex(context, camera, scale_factor) {
        context.strokeStyle = 'red';
        entities.forEach(entity => {
            context.beginPath();
            context.rect(
                (entity.bounds.left - camera.pos.x) * scale_factor.x,
                (entity.bounds.top - camera.pos.y) * scale_factor.y,
                entity.size.x * scale_factor.x,
                entity.size.y * scale_factor.y
            )
            context.stroke();
        })
    }
}

function createTileCandidatesLayer(tile_collider) {
    const resolvedTiles = []

    const tileResolver = tile_collider.tiles;
    const tileSize = tileResolver.tileSize;

    const getByIndexOriginal = tileResolver.getByIndex;
    tileResolver.getByIndex = function (x, y) {
        resolvedTiles.push({x, y})
        return getByIndexOriginal.call(tileResolver, x, y);
    }

    return function drawTileCandidates(context, camera, scale_factor) {
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({x, y}) => {
            context.beginPath();
            context.rect(
                (x * tileSize.x - camera.pos.x) * scale_factor.x,
                (y * tileSize.y - camera.pos.y) * scale_factor.y,
                tileSize.x * scale_factor.x,
                tileSize.y * scale_factor.y
            )
            context.stroke();
        })

        resolvedTiles.length = 0;
    }
}

export function createCollisionLayer(level) {

    const drawTileCandidates = createTileCandidatesLayer(level.tileCollider);
    const drawBoundingBoxes = createEntityLayer(level.entities)

    return function drawCollision(context, camera) {

        const scaleFactor = new Vector2(
            context.canvas.width / camera.size.x,
            context.canvas.height / camera.size.y
        )

        drawTileCandidates(context, camera, scaleFactor);
        drawBoundingBoxes(context, camera, scaleFactor);
    }
}

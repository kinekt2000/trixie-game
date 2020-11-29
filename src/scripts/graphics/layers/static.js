/**
 *
 * @param {Level} level
 * @param {Spritesheet} spritesheet -  spritesheet of tiles
 * @return {function (CanvasRenderingContext2D, Camera)}
 */
export function createStaticLayer(level, spritesheet) {
    const tiles = level.tiles
    const resolver = level.tileCollider.tiles

    const buffer = document.createElement('canvas');

    const context = buffer.getContext('2d');

    let cameraSet = false;


    let old_start_index_x, old_end_index_x,
        old_start_index_y, old_end_index_y;
    function redraw(start_index_x, end_index_x, start_index_y, end_index_y) {
        if(start_index_x === old_start_index_x
            && end_index_x   === old_end_index_x
            && start_index_y === old_start_index_y
            && end_index_y   === old_end_index_y)
        {
            return;
        }

        old_start_index_x = start_index_x;
        old_end_index_x   = end_index_x;
        old_start_index_y = start_index_y;
        old_end_index_y   = end_index_y;
        
        tiles.forEach(layer => {
            if(spritesheet.width === 1 || spritesheet.height === 1) {
                console.warn("Spritesheet not defined as tilesheet. Its width or height is equal to 1")
            }

            for(let x = start_index_x; x <= end_index_x; ++x) {
                for(let y = start_index_y; y <= end_index_y; ++y) {
                    const tile = layer.get(x, y);
                    if(tile) {
                        spritesheet.draw(tile.id, context, x - start_index_x, y - start_index_y);
                    }
                }
            }
        })
    }


    return function (context, camera) {
        if(!cameraSet) {
            buffer.width = camera.size.x + spritesheet.width;
            buffer.height = camera.size.y + spritesheet.height;
            cameraSet = true;
        }

        const drawWidth = resolver.toIndexX(camera.size.x);
        const drawHeight = resolver.toIndexY(camera.size.y);

        const drawFromX = resolver.toIndexX(camera.pos.x);
        const drawToX = drawFromX + drawWidth;

        const drawFromY = resolver.toIndexY(camera.pos.y);
        const drawToY = drawFromY + drawHeight

        redraw(drawFromX, drawToX, drawFromY, drawToY);

        context.drawImage(buffer, - camera.pos.x % spritesheet.width, - camera.pos.y % spritesheet.height);
    }

}

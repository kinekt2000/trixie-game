import {Vector2} from "@/util/math";
import TileResolver from "@/game/TileResolver";
import {Side} from "@/game/Entity";

export default class TileCollider {

    /**
     *
     * @param {Matrix} physical_map_of_tiles Matrix of physical tiles
     * @param {number} tile_width
     * @param {number} tile_height
     */
    constructor(physical_map_of_tiles, tile_width = 8, tile_height = 8) {
        this.tiles = new TileResolver(physical_map_of_tiles, new Vector2(tile_width, tile_height));
    }

    checkY(entity) {
        let y;
        if(entity.vel.y > 0) {
            y = entity.bounds.bottom;
        } else if (entity.vel.y < 0) {
            y = entity.bounds.top;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(
            entity.bounds.left, entity.bounds.right,
            y, y
        )

        matches.forEach(match => {
            if(match.tile.type !== 'solid') return;

            if(entity.vel.y > 0) {
                if(entity.bounds.bottom > match.y1) {
                    entity.obstruct(Side.BOTTOM, match);
                }
            } else if (entity.vel.y < 0) {
                if(entity.bounds.top < match.y2) {
                    entity.obstruct(Side.TOP, match);
                }
            }
        })
    }

    checkX(entity) {
        let x;
        if(entity.vel.x > 0) {
            x = entity.bounds.right;
        } else if (entity.vel.x < 0) {
            x = entity.bounds.left;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(
            x, x,
            entity.bounds.top, entity.bounds.bottom
        )

        matches.forEach(match => {
            if(match.tile.type !== 'solid') return;

            if(entity.vel.x > 0) {
                if(entity.bounds.right > match.x1) {
                    entity.obstruct(Side.RIGHT, match)
                }
            } else if (entity.vel.x < 0) {
                if(entity.bounds.left < match.x2) {
                    entity.obstruct(Side.LEFT, match)
                }
            }
        })
    }
}

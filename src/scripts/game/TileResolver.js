export default class TileResolver {
    /**
     *
     * @param {Matrix} matrix
     * @param {Vector2} tile_size
     */
    constructor(matrix, tile_size) {
        this.matrix = matrix
        this.tileSize = tile_size;
    }

    toIndexX(pos) {
        return Math.floor(pos / this.tileSize.x);
    }

    toIndexY(pos) {
        return Math.floor(pos / this.tileSize.y);
    }

    toIndexRangeX(pos1, pos2) {
        const pMax = Math.ceil(pos2 / this.tileSize.x) * this.tileSize.x;
        const range = [];
        let pos = pos1;
        do {
            range.push(this.toIndexX(pos));
            pos += this.tileSize.x;
        } while (pos < pMax);

        return range;
    }

    toIndexRangeY(pos1, pos2) {
        const pMax = Math.ceil(pos2 / this.tileSize.y) * this.tileSize.y;
        const range = [];
        let pos = pos1;
        do {
            range.push(this.toIndexY(pos));
            pos += this.tileSize.y;
        } while (pos < pMax);

        return range;
    }

    /**
     * <pre>
     *       y1
     *    ┌───────┐
     * x1 │ tile  │
     *    │       │ x2
     *    └───────┘
     *        y2
     * </pre>
     */
    getByIndex(index_x, index_y) {
        const tile = this.matrix.get(index_x, index_y);


        if(tile) {
            const y1 = index_y * this.tileSize.y;
            const y2 = y1 + this.tileSize.y;
            const x1 = index_x * this.tileSize.x;
            const x2 = x1 + this.tileSize.x;

            return {
                tile,
                y1,
                y2,
                x1,
                x2
            }
        }
    }

    searchByPosition(pos_x, pos_y) {
        return this.getByIndex(
            this.toIndexX(pos_x),
            this.toIndexY(pos_y)
        )
    }


    /**
     *
     * @param {number} x1 Left side of area
     * @param {number} x2 Right side of area
     * @param {number} y1 Top side of are
     * @param {number} y2 Bottom side of area
     * @return {[]}
     */
    searchByRange(x1, x2, y1, y2) {
        const matches = [];
        this.toIndexRangeX(x1, x2).forEach(index_x => {
            this.toIndexRangeY(y1, y2).forEach(index_y => {
                const match = this.getByIndex(index_x, index_y);
                if(match) {
                    matches.push(match)
                }
            })
        })

        return matches;
    }
}

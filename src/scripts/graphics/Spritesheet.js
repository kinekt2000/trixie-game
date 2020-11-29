import {Vector2} from "@/util/math";

export default class Spritesheet {
    /**
     *
     * @param {HTMLImageElement}  image
     * @param {number} [width]
     * @param {number} [height]
     * @param {number} [count]
     */
    constructor(image, width, height, count) {
        this.image = image;
        this.width = width || 1;
        this.height = height || 1;
        this.tileMap = new Map();
        this.tiles = [];

        this._ingnoreSize = false;

        if(count) {
            const maxCountX = Math.floor(image.width / this.width);

            for(let i = 0; i < count; i++){
                const buffer = document.createElement('canvas');
                buffer.width = width;
                buffer.height = height;
                buffer
                    .getContext('2d')
                    .drawImage(
                        image,
                        i % maxCountX * width,
                        Math.floor(i / maxCountX) * height,
                        width,
                        height,
                        0,
                        0,
                        width,
                        height
                    );
                this.tiles.push(buffer);
            }
        }
    }

    /**
     *
     * @param {string} name
     * @param {{x:number, y:number} | number} point Number of tile in tiles set or position of tile in tileset and start pixel of sprite
     * @param {number} [width]
     * @param {number} [height]
     */
    define(name, point, width, height) {
        if(typeof point === "number") {
            this.tileMap.set(name, [this.tiles[point], this.tiles[point]]);

        } else {
            const maxCountX = Math.floor(this.image.width / this.width);

            const index = point.y * maxCountX + point.x;
            if(this.tiles[index] && !width && !height) {
                const buffers = [false, true].map(flip => {
                    const tile = this.tiles[index]
                    if(flip) {
                        const buffer = document.createElement('canvas');
                        [buffer.width, buffer.height] = [tile.width, tile.height];

                        const context = buffer.getContext('2d');

                        context.scale(-1, 1);
                        context.translate(-buffer.width, 0);

                        context.drawImage(
                            buffer,
                            0,
                            0,
                        );

                    } else {
                        return tile;
                    }
                })

                this.tileMap.set(name, buffers);

            } else {

                const buffers = [false, true].map(flip => {
                    const buffer = document.createElement('canvas');

                    const _width = (width) ? width : this.width;
                    const _height = (height) ? height : this.height;

                    buffer.width = _width;
                    buffer.height = _height;

                    const _x = (width) ? point.x : point.x * this.width;
                    const _y = (height) ? point.y : point.y * this.height;

                    const context = buffer.getContext('2d');

                    if(flip) {
                        context.scale(-1, 1);
                        context.translate(-buffer.width, 0);
                    }

                    context.drawImage(
                        this.image,
                        _x,
                        _y,
                        _width,
                        _height,
                        0,
                        0,
                        _width,
                        _height
                    );

                    return buffer;
                })

                this.tileMap.set(name, buffers);
            }
        }
    }

    ignoreSize() {
        this._ingnoreSize = true;
    }

    getSize(name) {
        if(typeof name === 'string') {
            const sprite = this.tileMap.get(name)[0];
            return new Vector2(sprite.width, sprite.height);
        } else if (typeof name === 'number') {
            const sprite = this.tiles[name];
            return new Vector2(sprite.width, sprite.height);
        }
    }

    /**
     *
     * @param {string | number} name
     * @param {CanvasRenderingContext2D} context
     * @param {number} x
     * @param {number} y
     * @param {boolean} flip should sprite bo vertically flipped
     */
    draw(name, context, x, y, flip = false) {
        let buffer;
        if(typeof name === "number") {
            buffer = this.tiles[name];
        } else {
            buffer = this.tileMap.get(name)[flip ? 1 : 0];
        }

        context.drawImage(
            buffer,
            x * (this._ingnoreSize ? 1 : this.width),
            y * (this._ingnoreSize ? 1 : this.height)
        );
    }
}

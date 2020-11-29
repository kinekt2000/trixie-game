export class Matrix {
    constructor() {
        this.grid = [];
    }

    forEach(callback) {
        this.grid.forEach((col, x) => {
            col.forEach((value, y) => {
                callback(value, x, y);
            })
        })
    }

    get size() {
        const x = this.grid.length;
        const y = Math.max(...this.grid.map(col => col.length));
        return new Vector2(x, y);
    }

    get(x, y) {
        const col = this.grid[x];
        if(col) {
            return col[y];
        }
        return undefined;
    }

    set(x, y, value) {
        if(!this.grid[x]) {
            this.grid[x] = [];
        }

        this.grid[x][y] = value;
    }
}

export class Vector2 {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {

        if(x instanceof Vector2) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }
}

/**
 * Scale value x: x0<----...-x-...---->x1 to y0<----...-y-...---->y1
 * @param {number} value
 * @param {number} x0
 * @param {number} x1
 * @param {number} y0
 * @param {number} y1
 */
export function scale(value, x0, x1, y0, y1) {
    return y0 + (y1 - y0) * (value - x0)/(x1 - x0);
}

export function clamp(value, min, max) {
    if(value > max) {
        return max;
    }

    if(value < min) {
        return min;
    }

    return value;
}

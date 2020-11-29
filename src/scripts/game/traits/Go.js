import {Side, Trait} from "@/game/Entity";

export default class Go extends Trait{
    constructor() {
        super('go');
        this.dir = 0;
        this.acceleartion = 400;
        this.friction = 300;
        this.dragFactor = 1/5000;
        this.boosted = false;

        this.distance = 0;
        this.height = 0;
        this.heading = 1;
    }

    boostUp(drag_factor) {
        this.dragFactor = drag_factor;
        this.boosted = true;
    }

    slowDown(drag_factor) {
        this.dragFactor = drag_factor;
        this.boosted = false;
    }

    setDirection(direction) {
        this.dir += direction;
    }

    removeDirection(direction) {
        this.dir -= direction;
    }

    flipDirection() {
        this.dir = - this.dir;
    }

    obstruct(entity, side) {
        if(side === Side.BOTTOM) {
            this.height = 0;
        }
    }

    update(entity, {time}){
        const absX = Math.abs(entity.vel.x);

        if(this.dir !== 0) {
            entity.vel.x += this.acceleartion * time * this.dir;

            if(entity.jump) {
                if(entity.jump.takesOff === false) {
                    entity.heading = this.dir;
                }
            } else {
                entity.heading = this.dir;
            }

            this.heading = this.dir;
        } else if (entity.vel.x !== 0) {
            const friction = Math.min(absX, this.friction * time);
            entity.vel.x += entity.vel.x > 0 ? - friction : friction;
        } else {
            this.distance = 0;
        }

        if(this.acceleartion) {
            const drag = this.dragFactor * entity.vel.x * absX;
            entity.vel.x -= drag;
        }
        this.distance += absX * time;
        this.height += entity.vel.y * time;
    }
}

export const Direction = {
    LEFT: -1,
    RIGHT: 1,
    NONE: 0
}

import {Side, Trait} from "@/game/Entity";

export default class Jump extends Trait{
    constructor() {
        super('jump');

        this.ready = 0;
        this.duration = 0.15;
        this.velocity = 200;
        this.engageTime = 0;

        this.requestTime = 0;
        this.gracePeriod = 0.1;
        this.jumpBoost = 0.1;

        this.takesOff = false;
        this.height = 0;
    }

    start() {
        this.requestTime = this.gracePeriod;
    }

    cancel() {
        this.engageTime = 0;
    }

    obstruct(entity, side) {
        if(side === Side.BOTTOM) {
            this.ready = 1;
            this.height = 0;
        } else if (side === Side.TOP) {
            this.cancel()
        }
    }

    update(entity, {time, audio}, level) {
        if (this.requestTime > 0) {
            if(this.ready > 0) {
                this.sounds.add("jump");
                this.engageTime = this.duration;
                this.requestTime = 0;
            }

            this.requestTime -= time;
        }

        if(this.engageTime > 0) {
            entity.vel.y = - (this.velocity + Math.abs(entity.vel.x) * this.jumpBoost);
            this.engageTime -= time;
        }

        if(entity.vel.y < 0) {
            this.takesOff = true;
            this.height -= entity.vel.y * time;
        } else if (entity.vel.y > 0) {
            this.takesOff = false;
        }

        this.ready--;
    }


}

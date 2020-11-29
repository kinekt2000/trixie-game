import {Trait} from "@/game/Entity";

export default class Dash extends Trait {
    constructor() {
        super('dash');

        this.speed = 20;
        this.duration = .8;
        this.engageTime = 0;

        this.coolDown = 1;
        this.coolDownTime = 0;

    }

    get ready() {
        return this.coolDownTime <= 0;
    }

    start() {
        if(this.coolDownTime <= 0) {
            this.sounds.add('dash');
            this.coolDownTime = this.coolDown
            this.engageTime = this.duration;
        }
    }

    cancel() {
        this.engageTime = 0;
    }

    update(entity, {time}) {
        if(this.engageTime > 0) {
            entity.vel.x = this.speed * entity.heading
            this.engageTime -= time;
        } else {
            entity.vel.x = 0;
        }

        this.coolDownTime -= time;
    }

}

import {Trait} from "@/game/Entity";

export default class Killable extends Trait {
    static EVENT_DEAD = Symbol('dead');

    constructor() {
        super('killable');
        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = 1;
    }

    kill() {
        this.queue(() => {
            if(!this.dead) {
                this.sounds.add('death')
            }
            this.dead = true
        })
    }

    revive() {
        this.dead = false;
        this.deadTime = 0;

    }

    update(entity, {time}, level) {
        if(this.dead) {
            this.deadTime += time;
            if(this.deadTime > this.removeAfter) {
                entity.events.emit(Killable.EVENT_DEAD)
                this.queue(() => {level.entities.delete(entity)})
            }
        }
    }
}

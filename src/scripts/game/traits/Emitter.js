import {Trait} from "@/game/Entity";

export default class Emitter extends Trait {
    /**
     *
     * @param {number} interval
     */
    constructor(interval) {
        super('emitter');

        this.interval = interval;
        this.coolDown = this.interval;

        this.emitters = [];
    }

    add(callback) {
        this.emitters.push(callback);
    }

    emit(entity, game_context, level) {
        this.emitters.forEach(callback => {
            callback(entity, game_context, level);
        })
    }

    update(entity, game_context, level) {
        this.coolDown -= game_context.time;
        if(this.coolDown <= 0) {
            this.emit(entity, game_context, level);
            this.coolDown = this.interval;
        }
    }
}

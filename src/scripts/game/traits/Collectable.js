import {Trait} from "@/game/Entity";

export default class Collectable extends Trait {
    static EVENT_COLLECTED = Symbol("collected");

    constructor() {
        super('collectable');
        this.collected = false
    }

    collides(us, them) {
        if(them.player) {
            us.events.emit(Collectable.EVENT_COLLECTED, them);
            this.collected = true;
        }
    }

    update(entity, game_context, level) {
        if(this.collected) {
            this.sounds.add("collect")
            level.entities.delete(entity);
        }
    }
}

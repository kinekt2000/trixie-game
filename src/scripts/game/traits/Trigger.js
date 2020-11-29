import {Trait} from "@/game/Entity";

export default class Trigger extends Trait {
    constructor() {
        super('trigger');
        this.touches = new Set();

        this.conditions = [];
    }

    collides(_, them) {
        this.touches.add(them)
    }

    update(entity, game_context, level) {
        if(this.touches.size > 0) {
            for(const condition of this.conditions) {
                condition(entity, this.touches, game_context, level)
            }

            this.touches.clear();
        }
    }
}

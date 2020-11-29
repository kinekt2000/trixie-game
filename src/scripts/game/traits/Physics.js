import {Trait} from "@/game/Entity";

export default class Physics extends Trait {
    constructor() {
        super('physics');
        this.enabled = true;
    }

    update(entity, {time}, level) {
        if(!this.enabled) {
            return
        }

        entity.pos.x += entity.vel.x * time;
        level.tileCollider.checkX(entity)

        entity.pos.y += entity.vel.y * time;
        level.tileCollider.checkY(entity)

        entity.vel.y += level.gravity * time;
    }
}

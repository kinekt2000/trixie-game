import {Side, Trait} from "@/game/Entity";

export default class Solid extends Trait {
    constructor() {
        super('solid');
        this.obstructs = true;
    }

    obstruct(entity, side, match) {
        if(!this.obstructs) {
            return;
        }

        switch(side) {
            case Side.BOTTOM:
                entity.bounds.bottom = match.y1
                entity.vel.y = 0;
                break;

            case Side.TOP:
                entity.bounds.top = match.y2
                entity.vel.y = 0;
                break;

            case Side.LEFT:
                entity.bounds.left = match.x2
                entity.vel.x = 0;
                break;

            case Side.RIGHT:
                entity.bounds.right = match.x1
                entity.vel.x = 0;
                break;
        }
    }
}

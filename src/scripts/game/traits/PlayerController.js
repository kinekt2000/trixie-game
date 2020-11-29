import {Trait} from "@/game/Entity";
import {Vector2} from "@/util/math";

export default class PlayerController extends Trait {
    constructor() {
        super('playerController');
        this.player = null;
        this.checkPoint = new Vector2(32, 10)
    }

    setPlayer(entity) {
        this.player = entity;
    }

    update(entity, {time}, level) {
        if(!level.entities.has(this.player)) {
            this.player.pos.set(this.checkPoint)
            this.player.killable.revive();
            this.player.physics.enabled = true;
            level.entities.add(this.player);
        } else {
            this.time -= time;
            if(this.player.killable.dead) {
                this.player.physics.enabled = false;
            }
        }
    }
}

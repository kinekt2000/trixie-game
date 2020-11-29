import Entity, {Trait} from "@/game/Entity";
import {Vector2} from "@/util/math";

class AttackController extends Trait {
    static EVENT_KILLED = Symbol('killed')

    constructor() {
        super('attackController');

        this.killed = new Set()
    }

    collides(us, them) {
        if (them !== us.attacking) {
            if(them.killable) {
                if(!them.killable.dead) {
                    this.killed.add(them);
                }
                them.killable.kill();
            }
        }
    }

    update(us) {
        this.killed.forEach(entity => {
            us.events.emit(Melee.EVENT_KILLED, entity)
        })
        this.killed.clear();
    }
}

export default class Melee extends Trait {
    static EVENT_KILLED = Symbol('killed')

    constructor() {
        super('melee');

        this.attackTime = 0;
        this.attackDuration = .30;
        this.coolDownTime = 0;
        this.coolDownDuration = .40;

        this.range = new Vector2(16, 10);

        this.attackEntity = new Entity('attack');
        this.attackEntity.size.set(this.range);
        this.attackEntity.addTrait(new AttackController());
    }

    attack() {
        if(this.coolDownTime <= 0) {
            this.attackTime = this.attackDuration;
            this.coolDownTime = this.coolDownDuration;
            this.sounds.add("hit");
        }
    }

    get attacks() {
        return this.attackTime > 0;
    }

    update(entity, {time}, level) {
        if(this.attackTime === this.attackDuration) {
            level.entities.add(this.attackEntity);
            this.attackEntity.attacking = entity;
        }

        if(this.attackTime > 0) {
            this.attackEntity.bounds.top = entity.bounds.top + (entity.size.y - this.attackEntity.size.y)/2

            if(entity.heading === -1) {
                this.attackEntity.bounds.right = entity.bounds.left;
            } else {
                this.attackEntity.bounds.left = entity.bounds.right;
            }

            this.attackEntity.heading = entity.heading;

            this.attackTime -= time;
        } else {
            level.entities.delete(this.attackEntity);
        }

        this.coolDownTime -= time;

        this.attackEntity.attackController.listen(Melee.EVENT_KILLED, (them) => {
            entity.events.emit(Melee.EVENT_KILLED, them)
        }, 1)
    }
}

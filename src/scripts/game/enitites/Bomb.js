import Entity, {Trait} from "@/game/Entity";
import {loadSpritesheet} from "@/game/loaders/spritesheet";
import {loadJSON} from "@/util/loaders";

// traits
import Solid from "@/game/traits/Solid";
import Physics from "@/game/traits/Physics";
import Killable from "@/game/traits/Killable";

/**
 * @param {AudioContext} audio_context
 * @return {Promise<function(): Entity>}
 */
export function loadBomb(audio_context) {
    return loadJSON("/assets/sprites/bomb.json")
        .then(sprites_spec => loadSpritesheet(sprites_spec))
        .then(createBombFactory)
}

class BombController extends Trait {
    constructor() {
        super('controller');
        this.deadEffected = false;
        this.friction = 200;
        this.dragFactor = 1/3000;

        this.prevFalling = 0;
        this.explode = null;
    }
    

    collides(us, them) {
        if(us.killable.dead) {
            if(!this.deadEffected) {
                this.queue(() => {
                    us.vel.y = -100;
                    us.solid.obstructs = false;
                })
                this.deadEffected = true;
            }
            return;
        }

        if(them.player) {
            this.queue(() => {
                this.explode = {
                    x: them.pos.x + them.size.x / 2,
                    y: them.bounds.bottom
                }
            })
        }
    }

    detonate(pos, game_context, level) {
        const explosion = game_context.entityFactory.explosion();

        explosion.pos.x = pos.x - explosion.size.x / 2;
        explosion.bounds.bottom = pos.y;

        level.entities.add(explosion);
    }

    update(entity, game_context, level) {

        if(this.explode) {
            this.detonate(this.explode, game_context, level);
            level.entities.delete(entity);
        }

        const velY = entity.vel.y - this.prevFalling;
        this.prevFalling = entity.vel.y;
        const absX = Math.abs(entity.vel.x);


        if (entity.vel.x !== 0 && velY === 0) {
            const friction = Math.min(absX, this.friction * game_context.time);
            entity.vel.x += entity.vel.x > 0 ? - friction : friction;
        }

        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;

        if(entity.time >= 2) {
            this.queue(() => {
                this.explode = {
                    x: entity.pos.x + entity.size.x / 2,
                    y: entity.bounds.bottom
                }
            })
        }
    }
}

function createBombFactory(sprites) {

    const idleAnimation = sprites.animations.get('idle');

    function routeFrame(bomb) {
        if(bomb.killable.dead) {
            return 'dead'
        } else  {
            return idleAnimation(bomb.time)
        }
    }

    function resetBounds(bomb, new_bounds) {
        const diffX = bomb.size.x - new_bounds.x;
        const diffY = bomb.size.y - new_bounds.y;

        if (diffY) {
            bomb.size.y = new_bounds.y;
            bomb.pos.y += diffY;
        }
        if (diffX) {
            bomb.size.x = new_bounds.x;
            bomb.pos.x += diffX;
        }
    }


    function drawBomb(context) {
        const frameName = routeFrame(this);
        sprites.draw(routeFrame(this), context, 0, 0, this.vel.x < 0);
        return sprites.getSize(frameName)
    }


    return function createBomb(createExplosion) {
        const bomb = new Entity('bomb');
        bomb.pos.set(180, 100);
        bomb.size.set(7, 7);
        bomb.vel.set(-100, -20);


        bomb.addTrait(new BombController(createExplosion));
        bomb.addTrait(new Killable());
        bomb.addTrait(new Physics());
        bomb.addTrait(new Solid())


        /**
         * @param {Boolean} flag
         */
        bomb.draw = drawBomb;

        return bomb;
    }
}

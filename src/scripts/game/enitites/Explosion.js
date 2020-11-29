import Entity, {Trait} from "@/game/Entity";
import {loadSpritesheet} from "@/game/loaders/spritesheet";
import {loadJSON} from "@/util/loaders";

// traits
import Solid from "@/game/traits/Solid";
import Physics from "@/game/traits/Physics";
import Killable from "@/game/traits/Killable";
import {loadAudioBoard} from "@/game/loaders/audio";

/**
 * @param {AudioContext} audio_context
 * @return {Promise<function(): Entity>}
 */
export function loadExplosion(audio_context) {

    return Promise.all([
        loadJSON("/assets/sprites/explosion.json")
            .then(sprites_spec => loadSpritesheet(sprites_spec)),
        loadAudioBoard("explosion", audio_context)
    ]).then(([sprites, audio]) => createExplosionFactory(sprites, audio))
}

class ExplosionController extends Trait {
    constructor(createExplosion) {
        super('controller');
        this.dangerTimeBegin = 0.10;
        this.dangerTimeEnd = 1;
        this.explosionTime = 0;
        this.explosionDuration = 1.5;
    }


    collides(us, them) {
        if(this.explosionTime >= this.dangerTimeBegin && this.explosionTime <= this.dangerTimeEnd) {
            if (them.player) {
                them.killable.kill();
            }
        }
    }

    update(entity, {time}, level) {
        if(this.explosionTime === 0) {
            this.sounds.add("explosion");
        }
        this.explosionTime += time;
        if(this.explosionTime >= this.explosionDuration) {
            level.entities.delete(entity);
        }
    }
}

function createExplosionFactory(sprites, audio_board) {

    const boomAnimation = sprites.animations.get('boom');

    function routeFrame(explosion) {
        const frameName = boomAnimation(explosion.time);
        const [oldX, oldY] = [
            explosion.pos.x + explosion.size.x / 2,
            explosion.bounds.bottom
        ]
        resetBounds(explosion, sprites.getSize(frameName));

        explosion.pos.x = oldX - explosion.size.x / 2;
        explosion.bounds.bottom = oldY;

        return frameName;
    }

    function resetBounds(explosion, new_bounds) {
        const diffX = explosion.size.x - new_bounds.x;
        const diffY = explosion.size.y - new_bounds.y;

        if (diffY) {
            explosion.size.y = new_bounds.y;
            explosion.pos.y += diffY;
        }
        if (diffX) {
            explosion.size.x = new_bounds.x;
            explosion.pos.x += diffX;
        }
    }


    function drawExplosion(context) {
        const frameName = routeFrame(this);
        sprites.draw(routeFrame(this), context, 0, 0, this.vel.x < 0);
        return sprites.getSize(frameName)
    }


    return function createExplosion() {
        const explosion = new Entity('explosion');
        explosion.audioBoard = audio_board;

        explosion.pos.set(0, 0);
        explosion.size.set(5, 5);


        explosion.addTrait(new ExplosionController());


        /**
         * @param {Boolean} flag
         */
        explosion.draw = drawExplosion;

        return explosion;
    }
}

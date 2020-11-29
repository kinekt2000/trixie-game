import Entity, {Side, Trait} from "@/game/Entity";
import {loadSpritesheet} from "@/game/loaders/spritesheet";
import {loadJSON} from "@/util/loaders";

// traits
import Solid from "@/game/traits/Solid";
import Physics from "@/game/traits/Physics";
import Killable from "@/game/traits/Killable";
import Emitter from "@/game/traits/Emitter";
import {findPlayer} from "@/game/playerUtil";
import {loadAudioBoard} from "@/game/loaders/audio";

/**
 * @param {AudioContext} audio_context
 * @return {Promise<function(): Entity>}
 */
export function loadGoblinBomber(audio_context) {

    return Promise.all([
        loadJSON("/assets/sprites/goblin-bomber.json")
            .then(sprites_spec => loadSpritesheet(sprites_spec)),
        loadAudioBoard("goblin-bomber", audio_context)
    ]).then(([sprites, audio]) => createGoblinBomberFactory(sprites, audio))
}

const STATE = {
    IDLE: Symbol('idle'),
    THROWING: Symbol('throwing')
}

const FIRE_DISTANCE = 170;
const BOMB_BOOST_X = 10;
const BOMB_BOOST_Y = 10;

class GoblinBomberController extends Trait {
    constructor() {
        super('controller');
        this.state = STATE.IDLE;

        this.throwingDuration = 1;
        this.throwingTime = 0;

        this.bomb = null;

    }

    throw(bomb) {
        if(this.throwingTime <= 0) {
            this.sounds.add('throw');
            this.state = STATE.THROWING;
            this.bomb = bomb;
            this.throwingTime = this.throwingDuration;
        }
    }

    collides(us, them) {
        if(us.killable.dead) {
            return;
        }

        if(them.player) {
            them.killable.kill();
        }
    }

    update(entity, {time}, level) {
        this.throwingTime -= time;

        const player = findPlayer(level);
        if(player) {
            const diffX = entity.pos.x - player.pos.x;
            entity.heading = Math.sign(diffX);
        }

        if(this.throwingTime <= this.throwingDuration * 2 / 6) {
            if(this.bomb) {
                level.entities.add(this.bomb);
                this.bomb = null;
            }
        }

        if(this.throwingTime <= 0) {
            this.state = STATE.IDLE;
        }
    }
}

function createGoblinBomberFactory(sprites, audio_board) {
    const idleAnimation = sprites.animations.get('idle')
    const deadAnimation = sprites.animations.get('dead')
    const throwAnimation = sprites.animations.get('throw');

    function routeFrame(goblinBomber) {
        let frameName;

        if(goblinBomber.killable.dead) {
            frameName = deadAnimation(goblinBomber.killable.deadTime)
        } else if(goblinBomber.controller.state === STATE.THROWING){
            frameName = throwAnimation(goblinBomber.controller.throwingDuration - goblinBomber.controller.throwingTime)
            resetBounds(goblinBomber, sprites.getSize(frameName))
        } else {
            frameName = idleAnimation(goblinBomber.time);
            resetBounds(goblinBomber, sprites.getSize(frameName))
        }
        return frameName
    }

    function resetBounds(goblinBomber, new_bounds) {
        const diffX = goblinBomber.size.x - new_bounds.x;
        const diffY = goblinBomber.size.y - new_bounds.y;

        if (diffY) {
            goblinBomber.size.y = new_bounds.y;
            goblinBomber.pos.y += diffY;
        }
        if (diffX) {
            goblinBomber.size.x = new_bounds.x;
            goblinBomber.pos.x += diffX;
        }
    }


    function drawGoblinBomber(context) {
        const frameName = routeFrame(this);
        sprites.draw(routeFrame(this), context, 0, 0, this.heading > 0);
        return sprites.getSize(frameName)
    }

    function emitBomb(entity, gameContext, level) {
        if(entity.killable.dead) {
            return;
        }
        const player = findPlayer(level);
        if(!player){
            return
        }

        const diffX = player.pos.x - entity.pos.x;
        const diffY = player.pos.y - entity.pos.y;
        const distance = Math.sqrt(diffX*diffX + diffY*diffY);

        if(distance > FIRE_DISTANCE) {
            return;
        }

        const bomb = gameContext.entityFactory.bomb();
        bomb.vel.x = diffX * BOMB_BOOST_X;
        // const velY = (distance * level.gravity) / (2 * bomb.vel.x);
        // bomb.vel.y = Math.min(-10, velY)
        bomb.vel.y = Math.min(-10, diffY) + distance/5;

        bomb.pos.set(entity.bounds.left + entity.size.x / 2, entity.bounds.top);
        entity.controller.throw(bomb, level);
    }

    return function createGoblinBomber() {
        const goblinBomber = new Entity('goblin-bomber');
        goblinBomber.audioBoard = audio_board;

        goblinBomber.pos.set(0, 0);
        goblinBomber.size.set(14, 16);

        goblinBomber.addTrait(new GoblinBomberController());
        goblinBomber.addTrait(new Killable());
        goblinBomber.addTrait(new Emitter(2));
        goblinBomber.addTrait(new Solid());
        goblinBomber.addTrait(new Physics());

        goblinBomber.emitter.add(emitBomb);

        /**
         * @param {Boolean} flag
         */
        goblinBomber.draw = drawGoblinBomber;

        return goblinBomber;
    }
}

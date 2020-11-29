import Entity, {Side, Trait} from "@/game/Entity";
import {loadSpritesheet} from "@/game/loaders/spritesheet";
import {loadJSON} from "@/util/loaders";

// traits
import Go, {Direction} from "@/game/traits/Go";
import Dash from "@/game/traits/Dash";
import Solid from "@/game/traits/Solid";
import Physics from "@/game/traits/Physics";
import Killable from "@/game/traits/Killable";
import {loadAudioBoard} from "@/game/loaders/audio";

/**
 * @param {AudioContext} audio_context
 * @return {Promise<function(): Entity>}
 */
export function loadSlime(audio_context) {

    return Promise.all([
        loadJSON("/assets/sprites/slime.json")
            .then(sprites_spec => loadSpritesheet(sprites_spec)),
        loadAudioBoard("slime", audio_context)
    ]).then(([sprites, audio]) => createSlimeFactory(sprites, audio))
}

class SlimeController extends Trait {
    constructor() {
        super('controller');
        this.moving = true;
    }
    
    obstruct(slime, side) {
        if(side === Side.RIGHT || side === Side.LEFT) {
            slime.go.flipDirection();
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

    update(slime, {time}, level) {
        let x;

        if(slime.go.heading === 1) {
            x = Math.floor(slime.bounds.right / level.tileSize.x);
        } else if (slime.go.heading === -1) {
            x = Math.floor(slime.bounds.left / level.tileSize.x)
        }

        let y = Math.floor((slime.bounds.bottom + level.tileSize.y/2) / level.tileSize.y);

        const diagonalTile = level.physicalMap.get(x, y);
        if (!diagonalTile || diagonalTile.type !== 'solid') {
            slime.dash.cancel();
            if(slime.dash.ready) {
                slime.go.flipDirection();
            }
        }

        if(this.moving) {
            slime.dash.start();
        }
    }
}

function createSlimeFactory(sprites, audio_board) {
    const idleAnimation = sprites.animations.get('idle')
    const walkAnimation = sprites.animations.get('walk')
    const deadAnimation = sprites.animations.get('dead')

    function routeFrame(slime) {
        let frameName;
        // get frame

        if(slime.killable.dead) {
            frameName = deadAnimation(slime.killable.deadTime)
        } else if(slime.vel.x) {
            frameName = walkAnimation(slime.dash.coolDown - slime.dash.coolDownTime);
            resetBounds(slime, sprites.getSize(frameName))
        } else {
            frameName = idleAnimation(slime.time);
            resetBounds(slime, sprites.getSize(frameName))
        }

        return frameName;
    }

    function resetBounds(slime, new_bounds) {
        const diffX = slime.size.x - new_bounds.x;
        const diffY = slime.size.y - new_bounds.y;

        if (diffY) {
            slime.size.y = new_bounds.y;
            slime.pos.y += diffY;
        }
        if (diffX) {
            slime.size.x = new_bounds.x;
            slime.pos.x += diffX;
        }
    }


    function drawSlime(context) {
        const frameName = routeFrame(this);
        sprites.draw(routeFrame(this), context, 0, 0, this.heading > 0);
        return sprites.getSize(frameName)
    }

    return function createSlime() {
        const slime = new Entity('slime');
        slime.audioBoard = audio_board;

        slime.pos.set(0, 0);
        slime.size.set(14, 12);

        slime.addTrait(new Go());
        slime.go.acceleartion = 0;
        slime.go.setDirection(Direction.RIGHT)

        slime.addTrait(new Dash());
        slime.addTrait(new SlimeController());
        slime.addTrait(new Solid());
        slime.addTrait(new Physics());
        slime.addTrait(new Killable());

        /**
         * @param {Boolean} flag
         */
        slime.draw = drawSlime;

        return slime;
    }
}

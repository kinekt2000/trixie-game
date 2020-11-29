import Entity, {Trait} from "@/game/Entity";
import {loadSpritesheet} from "@/game/loaders/spritesheet";
import {loadJSON} from "@/util/loaders";

// traits
import Jump from "@/game/traits/Jump";
import Go from "@/game/traits/Go";
import Melee from "@/game/traits/Melee";
import Solid from "@/game/traits/Solid";
import Physics from "@/game/traits/Physics";
import Killable from "@/game/traits/Killable";
import {loadAudioBoard} from "@/game/loaders/audio";
import Player from "@/game/traits/Player";

/**
 * @param {AudioContext} audio_context
 * @return {Promise<function(): Entity>}
 */
export function loadPlayer(audio_context) {
    return Promise.all([
        loadJSON("/assets/sprites/player.json")
            .then(sprites_spec => loadSpritesheet(sprites_spec)),
        loadAudioBoard("player", audio_context)
    ]).then(([sprites, audio]) => createPlayerFactory(sprites, audio))
}


function createPlayerFactory(sprites, audio) {
    const SLOW_DRAG = 1/1000;
    const FAST_DRAG = 1/5000;

    const runAnimation = sprites.animations.get('run')
    const boostAnimation = sprites.animations.get('boost')
    const idleAnimation = sprites.animations.get('idle')
    const jumpAnimation = sprites.animations.get('jump')
    const fallAnimation = sprites.animations.get('fall')
    const attackAnimation = sprites.animations.get('attack')
    const deadAnimation = sprites.animations.get('dead');

    function routeFrame(player) {
        let frameName;

        if(player.killable.dead) {
            frameName = deadAnimation(player.killable.deadTime)
        } else if(player.melee.attacks) {
            frameName = attackAnimation(player.melee.attackDuration - player.melee.attackTime);
        } else if (player.jump.takesOff) {
            frameName = jumpAnimation(player.jump.height);
        } else if (player.go.height > 0) {
            frameName = fallAnimation(player.go.height);
        } else if (player.go.distance > 0) {
            if (player.go.boosted) {
                frameName = boostAnimation(player.go.distance);
                resetBounds(player, sprites.getSize(frameName));
            } else {
                frameName = runAnimation(player.go.distance);
                resetBounds(player, sprites.getSize(frameName));
            }
        } else {
            frameName = idleAnimation(player.time);
            resetBounds(player, sprites.getSize(frameName));
        }

        return frameName;
    }

    function resetBounds(player, new_bounds) {
        const diffX = player.size.x - new_bounds.x;
        const diffY = player.size.y - new_bounds.y;

        if (diffY) {
            player.size.y = new_bounds.y;
            player.pos.y += diffY;
        }
        if (diffX) {
            player.size.x = new_bounds.x;
            player.pos.x += diffX;
        }
    }

    function speedUpState(flag) {
        if (flag) {
            this.go.boostUp(FAST_DRAG);
        } else {
            this.go.slowDown(SLOW_DRAG);
        }
    }

    function drawPlayer(context) {
        const frameName = routeFrame(this);
        sprites.draw(frameName, context, 0, 0, this.heading < 0);
        return sprites.getSize(frameName)
    }

    return function createPlayer() {
        const player = new Entity('player');
        player.audioBoard = audio;

        player.pos.set(0, 0);
        player.size.set(11, 15);

        player.addTrait(new Go());
        player.addTrait(new Jump());
        player.addTrait(new Melee());
        player.addTrait(new Solid());
        player.addTrait(new Physics());
        player.addTrait(new Killable());
        player.addTrait(new Player());

        /**
         * @param {Boolean} flag
         */
        player.speedUpState = speedUpState
        player.speedUpState(false);
        player.draw = drawPlayer

        return player;
    }
}

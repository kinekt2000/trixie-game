import Entity, {Trait} from "@/game/Entity";
import {loadSpritesheet} from "@/game/loaders/spritesheet";
import {loadJSON} from "@/util/loaders";
import {loadAudioBoard} from "@/game/loaders/audio";
import Collectable from "@/game/traits/Collectable";
import Killable from "@/game/traits/Killable";

// traits

/**
 * @param {AudioContext} audio_context
 * @return {Promise<function(*): Entity>}
 */
export function loadNexus(audio_context) {
    return Promise.all([
        loadJSON("/assets/sprites/nexus.json")
            .then(sprites_spec => loadSpritesheet(sprites_spec)),
        loadAudioBoard("nexus", audio_context)
    ])
        .then(([sprites, audio]) => createNexusFactory(sprites, audio))
}

function createNexusFactory(sprites, audio_board) {

    const idleAnimation = sprites.animations.get('idle');
    const deadAnimation = sprites.animations.get('dead');

    function routeFrame(nexus) {
        if(nexus.killable.dead){
            return deadAnimation(nexus.killable.deadTime);
        } else {
            return idleAnimation(nexus.time)
        }
    }


    function drawNexus(context) {
        const frameName = routeFrame(this);
        sprites.draw(routeFrame(this), context, 0, 0);
        return sprites.getSize(frameName)
    }


    return function createNexus() {
        const nexus = new Entity('nexus');
        nexus.audioBoard = audio_board;

        nexus.pos.set(0, 0);
        nexus.size.set(8, 8);
        nexus.vel.set(0, 0);


        nexus.addTrait(new Killable());

        /**
         * @param {Boolean} flag
         */
        nexus.draw = drawNexus;

        return nexus;
    }
}

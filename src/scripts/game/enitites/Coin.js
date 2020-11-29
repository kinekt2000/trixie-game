import Entity, {Trait} from "@/game/Entity";
import {loadSpritesheet} from "@/game/loaders/spritesheet";
import {loadJSON} from "@/util/loaders";
import {loadAudioBoard} from "@/game/loaders/audio";
import Collectable from "@/game/traits/Collectable";

// traits

/**
 * @param {AudioContext} audio_context
 * @return {Promise<function(*): Entity>}
 */
export function loadCoin(audio_context) {
    return Promise.all([
        loadJSON("/assets/sprites/coin.json")
            .then(sprites_spec => loadSpritesheet(sprites_spec)),
        loadAudioBoard("coin", audio_context)
    ])
        .then(([sprites, audio]) => createCoinFactory(sprites, audio))
}

function createCoinFactory(sprites, audio_board) {

    const idleAnimation = sprites.animations.get('idle');

    function routeFrame(coin) {
        return idleAnimation(coin.time)
    }


    function drawCoin(context) {
        const frameName = routeFrame(this);
        sprites.draw(routeFrame(this), context, 0, 0);
        return sprites.getSize(frameName)
    }


    return function createCoin() {
        const coin = new Entity('coin');
        coin.audioBoard = audio_board;

        coin.pos.set(180, 100);
        coin.size.set(6, 6);
        coin.vel.set(0, 0);


        coin.addTrait(new Collectable());
        const listener = new Trait('coinListener');
        listener.listen(Collectable.EVENT_COLLECTED, (player_entity) => {
            player_entity.player.addCoins();
        })
        coin.addTrait(listener);

        /**
         * @param {Boolean} flag
         */
        coin.draw = drawCoin;

        return coin;
    }
}

import {Trait} from "@/game/Entity";
import Melee from "@/game/traits/Melee";
import Killable from "@/game/traits/Killable";
import {Level} from "@/game/Level";

const COIN_LIFE_THRESHOLD = 10;

export default class Player extends Trait {
    constructor() {
        super('player');
        this.coins = 0;
        this.lives = 2;
        this.score = 0;

        this.listen(Melee.EVENT_KILLED, (them) => {
            this.score += 10 // should depend on 'them'
        })

        this.listen(Killable.EVENT_DEAD, () => {
            this.lives --;
        })
    }

    addCoins(count = 1) {
        this.coins += count;
        while(this.coins >= COIN_LIFE_THRESHOLD) {
            this.addLives(1);
            this.coins -= COIN_LIFE_THRESHOLD;
        }
    }

    addLives(count) {
        this.lives += count
    }

    update(player, game_context, level) {
        if(this.lives === 0) {
            level.events.emit(Level.EVENT_GAMEOVER, this);
        }
    }
}

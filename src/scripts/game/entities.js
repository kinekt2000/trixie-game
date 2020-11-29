import {loadPlayer} from "@/game/enitites/Player";
import {loadSlime} from "@/game/enitites/Slime";
import {loadGoblinBomber} from "@/game/enitites/GoblinBomber";
import {loadBomb} from "@/game/enitites/Bomb";
import {loadExplosion} from "@/game/enitites/Explosion";
import {loadCoin} from "@/game/enitites/Coin";
import {loadNexus} from "@/game/enitites/Nexus";

export function loadEntities(audio_context) {
    const entityFactory = {}

    function addAs(name) {
        return factory => entityFactory[name] = factory
    }

    return Promise.all([
        loadPlayer(audio_context).then(addAs('player')),
        loadSlime(audio_context).then(addAs('slime')),
        loadGoblinBomber(audio_context).then(addAs('goblin-bomber')),
        loadBomb(audio_context).then(addAs('bomb')),
        loadExplosion(audio_context).then(addAs('explosion')),
        loadCoin(audio_context).then(addAs('coin')),
        loadNexus(audio_context).then(addAs('nexus'))
    ])
        .then(() => entityFactory);
}

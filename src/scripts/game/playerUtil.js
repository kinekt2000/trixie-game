import Entity from "@/game/Entity";
import PlayerController from "@/game/traits/PlayerController";

export function createPlayerEnvironment(player) {
    const playerEnv = new Entity('playerEnv');
    const playerController = new PlayerController();
    playerController.setPlayer(player)
    playerController.checkPoint.set(player.pos);
    playerEnv.addTrait(playerController)
    return playerEnv;
}

export function findPlayer(level) {
    for(const entity of level.entities) {
        if(entity.player) {
            return entity;
        }
    }
    return undefined
}

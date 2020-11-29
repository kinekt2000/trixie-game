import {findPlayer} from "@/game/playerUtil";

function getPlayerTrait(level) {
    const entity = findPlayer(level);
    if(entity) {
        return entity.player;
    }
    return undefined;
}

function getTimerTrait(level) {
    for(const entity of level.entities) {
        if(entity.levelTimer) {
            return entity.levelTimer;
        }
    }
    return undefined;
}

export function createDashboardLayer(font, level) {

    function line(n){
        return 1 + (n - 1) * font.sprites.height
    }

    return function drawDashboard(context) {
        const playerTrait = getPlayerTrait(level);
        const score = playerTrait ? playerTrait.score : 0;
        const coins = playerTrait ? playerTrait.coins : 0;
        const lives = playerTrait ? playerTrait.lives : 0;

        const timerTrait = getTimerTrait(level);
        const time = timerTrait ? timerTrait.currentTime : 999;

        font.print("SCORE", context, 1, line(1));
        font.print(score.toString().padStart(6, '0'), context, 1, line(2));

        font.print("* "+lives.toString().padStart(2, '0'), context, 100, line(1));
        font.print("@x"+coins.toString().padStart(2, '0'), context, 100, line(2));

        font.print("TIME", context, 208, line(1));
        font.print(time.toString().padStart(3, '0'), context, 216, line(2));
    }
}

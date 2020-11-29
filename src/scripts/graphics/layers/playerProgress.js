import {findPlayer} from "@/game/playerUtil";

function getPlayer(level) {
    const entity = findPlayer(level);
    if(entity) {
        return entity;
    }
    return undefined;
}

export function createPlayerProgressLayer(font, level) {

    function line(n){
        return 1 + (n - 1) * font.sprites.height
    }

    const spriteBuffer = document.createElement('canvas')
    spriteBuffer.width = 32;
    spriteBuffer.height = 32;
    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawPlayerProgress(context) {
        const entity = getPlayer(level);
        const score = entity ? entity.player.score : 0;
        const coins = entity ? entity.player.coins : 0;
        const lives = entity ? entity.player.lives : 0;

        if(entity) {
            spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height);
            entity.draw(spriteBufferContext);
        }

        font.print(
            "SCORE  " + score.toString().padStart(6, '0'),
            context, 65, line(4)
        );

        font.print("@x"+coins.toString().padStart(2, '0'), context, 100, line(6));

        context.drawImage(spriteBuffer, 100, line(8))
        font.print(lives.toString().padStart(2, '0'), context, 115, line(9));
    }
}

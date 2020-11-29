import {clamp, Matrix, Vector2} from "@/util/math";
import TileCollider from "@/game/TileCollider";
import EntityCollider from "@/game/EntityCollider";
import MusicController from "@/audio/MusicController";
import Camera from "@/game/Camera";
import {findPlayer} from "@/game/playerUtil";
import Scene from "@/game/Scene";


function focusPlayer(level) {
    const player = findPlayer(level);
    if(player) {
        level.camera.pos.x = Math.floor(clamp(
            player.bounds.left - level.camera.size.x/2,
            0,
            level.size.x - level.camera.size.x
        ));

        level.camera.pos.y = Math.floor(clamp(
            player.bounds.bottom - level.camera.size.y/2,
            0,
            level.size.y - level.camera.size.y
        ));

    }
}

export class Level extends Scene{
    static EVENT_TRIGGER  = Symbol("trigger")
    static EVENT_GAMEOVER = Symbol("gameover")
    static EVENT_WIN      = Symbol('win')

    constructor() {
        super();
        this.gravity = 980;

        this.music = new MusicController();

        this.entities = new Set();
        this.camera = new Camera();
        this.camera.size.set(240, 120);

        /** @type {Matrix[]} */
        this.tiles = [] ;
        this.size = new Vector2(0, 0);
        this.tileSize = new Vector2(0, 0);

        this.physicalMap = new Matrix();
        this.tileCollider = new TileCollider(this.physicalMap);
        this.entityCollider = new EntityCollider(this.entities);

        this.width = 0;
        this.height = 0;
    }


    draw(display) {
        this.staticLayerController.draw(display.staticBuffer, this.camera);
        this.dynamicLayerController.draw(display.dynamicBuffer, this.camera);
    }


    update(game_context) {
        this.entities.forEach(entity => {
            entity.update(game_context, this);
            if(entity.bounds.top > this.size.y) {
                if(entity.killable) {
                    entity.killable.kill();
                } else {
                    this.entities.delete(entity);
                }
            }
        })

        this.entities.forEach(entity => {
            this.entityCollider.check(entity)
        })

        this.entities.forEach(entity => {
            entity.finalize()
        })

        focusPlayer(this);
    }

    getTime(){
        const levelTimer = [...this.entities].find(entity => entity.levelTimer).levelTimer;
        return Math.floor(levelTimer.currentTime);
    }

    pause() {
        this.music.pause();
    }
}

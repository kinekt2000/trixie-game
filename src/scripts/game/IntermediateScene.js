import Scene from "@/game/Scene";

export default class IntermediateScene extends Scene{
    constructor() {
        super();
        this.countDown = 2;
    }

    draw(display) {
        this.staticLayerController.draw(display.staticBuffer);
    }

    update(game_context) {
        this.countDown -= game_context.time;
        if(this.countDown <= 0) {
            this.events.emit(Scene.EVENT_COMPLETE);
        }
    }
}

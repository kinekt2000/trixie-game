import EventEmitter from "@/game/EventEmitter";
import LayerController from "@/graphics/LayerController";

export default class Scene {
    static EVENT_COMPLETE = Symbol("complete");

    constructor() {
        this.events = new EventEmitter();
        this.staticLayerController  = new LayerController();
        this.dynamicLayerController = new LayerController();
    }

    draw(display) {
        this.staticLayerController.draw(display.staticBuffer)
        this.dynamicLayerController.draw(display.staticBuffer);
    }

    update(game_context){}

    pause() {}
}

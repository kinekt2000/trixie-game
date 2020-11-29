import {Trait} from "@/game/Entity";

export default class LevelTimer extends Trait{
    static EVENT_TIMER_HURRY = Symbol("timer_hurry")
    static EVENT_TIMER_OK = Symbol("timer_ok")

    constructor() {
        super('levelTimer');
        this.totalTime = 500;
        this.currentTime = this.totalTime;
        this.hurryTime = 100;

        this.hurryEmitted = null;
    }

    update(entity, gameContext, level) {
        this.currentTime -= gameContext.time * 2;
        if(this.hurryEmitted !== true && this.currentTime < this.hurryTime) {
            level.events.emit(LevelTimer.EVENT_TIMER_HURRY)
            this.hurryEmitted = true;
        }

        if(this.hurryEmitted !== false && this.currentTime > this.hurryTime) {
            level.events.emit(LevelTimer.EVENT_TIMER_OK)
            this.hurryEmitted = false;
        }
    }
}

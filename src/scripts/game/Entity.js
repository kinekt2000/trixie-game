import {Vector2} from "@/util/math";
import BoundingBox from "@/game/BoundingBox";
import AudioBoard from "@/audio/AudioBoard";
import EventBuffer from "@/game/EventBuffer";

export const Side = {
    TOP: Symbol("top"),
    BOTTOM: Symbol("bottom"),
    RIGHT: Symbol("right"),
    LEFT: Symbol("left")
}

export class Trait {
    static EVENT_TASK = Symbol('task');

    constructor(name) {
        this.NAME = name;

        this.sounds = new Set();
        this.listeners = [];
    }

    listen(name, callback, count = Infinity) {
        const listener = {name, callback, count};
        this.listeners.push(listener);
    }

    queue(task) {
        this.listen(Trait.EVENT_TASK, task, 1);
    }

    finalize(entity) {
        this.listeners = this.listeners.filter(listener => {
            entity.events.process(listener.name, listener.callback);
            return --listener.count
        })
    }

    playSounds(audioBoard, audio_context) {
        this.sounds.forEach(name => {
            audioBoard.playAudio(name, audio_context)
        })

        this.sounds.clear();
    }

    obstruct() {

    }

    collides(us, them) {
    }

    update(entity, game_context, level) {
    }
}

export default class Entity {
    constructor(name) {
        this.NAME = name;
        this.events = new EventBuffer();

        this.audioBoard = new AudioBoard();
        this.pos = new Vector2(0, 0);
        this.vel = new Vector2(0, 0);
        this.size = new Vector2(0, 0);
        this.offset = new Vector2(0, 0);

        this.bounds = new BoundingBox(this.pos, this.size, this.offset)
        this.heading = 1;

        this.time = 0;
        this.timeLimit = 3600;

        this.traits = []
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    obstruct(...args) {
        this.traits.forEach(trait => {
            trait.obstruct(this, ...args)
        })
    }

    collides(candidate) {
        this.traits.forEach(trait => {
            trait.collides(this, candidate);
        })
    }

    draw() {

    }

    finalize() {
        this.events.emit(Trait.EVENT_TASK)

        this.traits.forEach(trait => {
            trait.finalize(this);
        })

        this.events.flush();
    }

    update(game_context, level) {
        this.time += game_context.time;
        if(this.time > this.timeLimit) {
            this.time -= this.timeLimit;
        }

        this.traits.forEach(trait => {
            trait.update(this, game_context, level);
            trait.playSounds(this.audioBoard, game_context.audio);
        })
    }
}

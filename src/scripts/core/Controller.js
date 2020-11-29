

class Controller {
    /**
     *
     * @param {Window} window
     */
    constructor(window) {
        this.keyMapping = new Map();

        window.addEventListener("keydown", this.handleEvent);
        window.addEventListener("keyup",   this.handleEvent);
    }

    handleEvent = (event) => {
        event.preventDefault();
        this.keyDownUp(event.type, event.key);
    }

    disable() {
        window.removeEventListener("keydown", this.handleEvent);
        window.removeEventListener("keyup", this.handleEvent);
    }

    /**
     *
     * @param {string[]} keys Array of button keys
     * @param {string} name Name of trait
     * @param {function ()} press_callback Function will be called when pressed
     * @param {function ()} release_callback Function will be called when released
     */
    addKey(keys, name, press_callback, release_callback) {
        const buttonInput = new Controller.ButtonInput;

        keys.forEach(key => {
            this.keyMapping.set(
                key,
                {
                    input: buttonInput,
                    press: press_callback,
                    release: release_callback
                }
            );
        })

        this[name] = buttonInput;
    }

    keyDownUp(type, key) {
        const down = (type === "keydown")

        const keyHandlers = this.keyMapping.get(key);
        if(!keyHandlers) return;

        if(!keyHandlers.input.active && down) {
            if(keyHandlers.press) keyHandlers.press();
        }

        if(keyHandlers.input.active && !down) {
            if(keyHandlers.release) keyHandlers.release();
        }

        keyHandlers.input.getInput(down);
    }
}

Controller.ButtonInput = class {
    constructor() {
        this.active = this.down = false;
    }

    getInput(down) {
        if(this.down !== down) this.active = down;
        this.down = down;
    }
}

export default Controller

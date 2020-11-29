export default class EventBuffer {
    constructor() {
        this.events = [];
    }

    /**
     *
     * @param {any} event_name
     * @param {...*} args
     */
    emit(name,...args) {
        const event = {name, args};
        this.events.push(event)
    }

    /**
     *
     * @param {any} event_name
     * @param {function(...*)} callback
     */
    process(event_name, callback) {
        this.events.forEach(event => {
            if(event.name === event_name) {
                callback(...event.args)
            }
        })
    }

    flush() {
        this.events.length = 0;
    }
}

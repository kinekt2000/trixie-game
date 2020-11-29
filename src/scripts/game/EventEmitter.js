export default class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }

    /**
     *
     * @param event_name
     * @param {function(...*)} callback
     */
    listen(event_name, callback) {
        if(!this.listeners[event_name]) {
            this.listeners[event_name] = [];
        }
        this.listeners[event_name].push(callback);
    }

    /**
     *
     * @param event_name
     * @param {...*} args
     */
    emit(event_name,...args) {
        const callbacks = this.listeners[event_name];

        if(callbacks){
            callbacks.forEach(callback => callback(...args));
        }
    }
}

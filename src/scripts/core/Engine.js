class Engine {
    /**
     *
     * @param {number } time_step
     * @param {function} update
     * @param {function} render
     */
    constructor(time_step, update, render) {
        this.accumulated_time        = 0;
        this.animation_frame_request = undefined;
        this.time                    = undefined;
        this.time_step               = time_step;

        this.updated = false;

        this.update = update;
        this.render = render;

        this.handleRun = (time_step) => {
            this.run(time_step);
        }
    }

    /**
     *
     * @param {number} time_stamp
     */
    run(time_stamp) {
        this.accumulated_time += time_stamp - this.time;
        this.time = time_stamp;

        if(this.accumulated_time >= this.time_step * 3) {
            this.accumulated_time = this.time_step;
        }

        while(this.accumulated_time >= this.time_step) {
            this.accumulated_time -= this.time_step;
            this.update(this.time_step/1000);
            this.updated = true;
        }

        if(this.updated) {
            this.updated = false;
            this.render();
        }

        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
    }

    start() {
        this.accumulated_time = this.time_step;
        this.time = window.performance.now();
        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
    }

    stop() {
        window.cancelAnimationFrame(this.animation_frame_request)
    }
}

export default Engine

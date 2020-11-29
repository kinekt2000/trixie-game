class Display {
    constructor(canvas) {
        this.staticBuffer  = document.createElement("canvas").getContext("2d");
        this.staticBuffer.imageSmoothingEnabled = false;

        const dynamicCanvas = document.createElement("canvas");

        dynamicCanvas.width = canvas.width;
        dynamicCanvas.height = canvas.height;
        this.dynamicBuffer = dynamicCanvas.getContext("2d");

        this.context = canvas.getContext("2d");
    }

    render() {
        [this.staticBuffer, this.dynamicBuffer].forEach(buffer => {
            this.context.drawImage(
                buffer.canvas,
                0,
                0,
                buffer.canvas.width,
                buffer.canvas.height,
                0,
                0,
                this.context.canvas.width,
                this.context.canvas.height
            );

        })

        this.dynamicBuffer.clearRect(0, 0, this.dynamicBuffer.canvas.width, this.dynamicBuffer.canvas.height)
    }

    resize(width, height, height_width_ratio) {
        if (height/width > height_width_ratio) {
            this.context.canvas.height =
                this.dynamicBuffer.canvas.height = width * height_width_ratio;
            this.context.canvas.width =
                this.dynamicBuffer.canvas.width = width;

        } else {
            this.context.canvas.height =
                this.dynamicBuffer.canvas.height = height;
            this.context.canvas.width =
                this.dynamicBuffer.canvas.width = height / height_width_ratio;
        }

        this.context.imageSmoothingEnabled = false;
    }
}

export default Display

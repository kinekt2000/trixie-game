export function createImageLayer(image) {
    return function drawImage(context) {
        const cWidth = context.canvas.width;
        const cHeight = context.canvas.height;
        context.drawImage(
            image,
            0, 0,
            image.width, image.height,
            0, 0,
            cWidth, cHeight
        );
    }
}

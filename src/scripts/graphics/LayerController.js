export default class LayerController {
    constructor() {
        this.layers = [];
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     * @param camera
     */
    draw(context, camera) {
        this.layers.forEach(layer => {
            layer(context, camera)
        });
    }
}

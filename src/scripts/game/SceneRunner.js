export default class SceneRunner {
    constructor() {
        this.sceneName = null;
        this.scenes = new Map();
    }

    addScene(name, scene) {
        this.scenes.set(name, scene);
    }

    removeScene(name) {
        this.scenes.delete(name);
    }

    runScene(name) {
        const currentScene = this.scenes.get(name);
        if(currentScene) {
            currentScene.pause();
        }
        this.sceneName = name;
    }

    update(gameContext) {
        const currentScene = this.scenes.get(this.sceneName);
        if(currentScene) {
            currentScene.update(gameContext);
        }
    }

    draw(display) {
        const currentScene = this.scenes.get(this.sceneName);
        if(currentScene) {
            currentScene.draw(display);
        }
    }
}

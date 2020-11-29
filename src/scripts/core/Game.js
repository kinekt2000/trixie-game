import {createPlayerEnvironment} from "@/game/playerUtil";
import {createDashboardLayer} from "@/graphics/layers/dashboard";
import SceneRunner from "@/game/SceneRunner";
import IntermediateScene from "@/game/IntermediateScene";
import {createPlayerProgressLayer} from "@/graphics/layers/playerProgress";
import Scene from "@/game/Scene";
import {setupKeyboard} from "@/game/input";
import {createColorLayer} from "@/graphics/layers/createColorLayer";
import {createCollisionLayer} from "@/graphics/layers/collision";
import {Level} from "@/game/Level";
import {createTextLayer} from "@/graphics/layers/text";
import {createImageLayer} from "@/graphics/layers/image";

let runLevel = null

class Game {

    /**
     * @param {Display} display
     * @param {Function} gameover
     * @param {Function} win
     */
    constructor(display, gameover, win) {
        this.gameContext = {
            audio: null,
            time: null,
            entityFactory: null
        }

        this.sceneRunner = new SceneRunner();

        this.display = display;
        this.gameover = gameover;
        this.win = win;

        this.accumulatedTime = 0;
        this.inputRouter = null;
    }


    init(controller, audio_context, font, load_level, entity_factory, start_image) {
        const initialScene = new Scene();
        initialScene.dynamicLayerController.layers.push(createImageLayer(start_image));
        this.sceneRunner.addScene("initial", initialScene);
        this.sceneRunner.runScene("initial");

        this.gameContext.audio = audio_context;
        this.font = font;
        this.gameContext.entityFactory = entity_factory

        let currentLevel = "";
        runLevel = async (name) => {
            const prevLevel = currentLevel;
            currentLevel = name;

            if(this.level) {
                this.accumulatedTime += this.level.getTime();
            }

            const loadScreen = new Scene();
            loadScreen.staticLayerController.layers.push(createColorLayer("#000"));
            loadScreen.staticLayerController.layers.push(createTextLayer(this.font, 2, "Loading...", "Please, wait"));
            this.sceneRunner.addScene("load", loadScreen);
            this.sceneRunner.runScene("load");

            const [level, player] = await load_level(name);

            level.events.listen(Level.EVENT_TRIGGER, (trigger_spec, targets) => {
                if(trigger_spec.type === "goto") {
                    for (const entity of targets) {
                        if (entity.player) {
                            const nexus = [...level.entities.values()].find(entity => entity.NAME === "nexus");
                            // const nexus = false;
                            if(!nexus){
                                runLevel(trigger_spec.name);
                            }
                        }
                    }
                } else if(trigger_spec.type === "finish") {
                    for (const entity of targets) {
                        if (entity.player) {
                            const nexus = [...level.entities.values()].find(entity => entity.NAME === "nexus");
                            // const nexus = false;
                            if(!nexus){
                                level.events.emit(Level.EVENT_WIN, entity.player);
                            }
                        }
                    }
                }
            })

            level.events.listen(Level.EVENT_GAMEOVER, (player) => {
                const coins = player.coins;
                const score = player.score;

                const totalScore = score + coins * 5;

                const gameoverScreen = new Scene();
                gameoverScreen.staticLayerController.layers.push(createColorLayer('#000'))
                gameoverScreen.staticLayerController.layers.push(createTextLayer(
                    font, 2,
                    "GAMEOVER!",
                    " ",
                    `@: ${coins} > ${coins * 5}`,
                    `Score: ${score}`,
                    `TOTAL: ${totalScore}`
                ))

                this.sceneRunner.addScene('gameover', gameoverScreen);
                this.sceneRunner.runScene('gameover');
                level.music.playGameOverTheme();
                this.gameover(totalScore);
            })

            level.events.listen(Level.EVENT_WIN, (player) => {
                const coins = player.coins;
                const extraLives = player.lives - 1;
                const time = this.accumulatedTime + this.level.getTime();
                const score = player.score;

                console.log(player);

                const totalScore = score + coins * 5 + extraLives * 60 + time;
                const winScreen = new Scene();
                winScreen.staticLayerController.layers.push(createColorLayer("#000"));
                winScreen.staticLayerController.layers.push(createTextLayer(
                    this.font, 2,
                    "Congratulations",
                    "You won!",
                    "",
                    `@: ${coins} > ${coins * 5}`,
                    `*: ${extraLives + 1} > ${extraLives * 60}`,
                    `Time: ${time}`,
                    `Score: ${score}`,
                    `TOTAL: ${totalScore}`
                ))

                this.sceneRunner.addScene('win', winScreen);
                this.sceneRunner.runScene('win');
                level.music.playGameCompleteTheme();
                this.win(totalScore);
            })

            if(!prevLevel) {
                this.player = player;
                this.inputRouter = setupKeyboard(controller, player);
                this.inputRouter.addReceiver(player);
            } else {
                this.player.pos.set(player.pos);
                this.level.music.playLevelCompleteTheme();
            }


            this.level = level;
            this.playerEnv = createPlayerEnvironment(this.player);
            this.level.entities.add(this.playerEnv);
            this.level.entities.add(this.player);

            this.display.staticBuffer.canvas.height = level.camera.size.y;
            this.display.staticBuffer.canvas.width  = level.camera.size.x;

            level.staticLayerController.layers.push(createDashboardLayer(this.font, level));
            // level.dynamicLayerController.layers.push(createCollisionLayer(level));

            this.sceneRunner.addScene(name, level);

            const intermediateScreen = new IntermediateScene();
            intermediateScreen.staticLayerController.layers.push(createColorLayer("#000"));
            intermediateScreen.staticLayerController.layers.push(createPlayerProgressLayer(font, level));
            intermediateScreen.events.listen(Scene.EVENT_COMPLETE, () => {
                this.sceneRunner.runScene(name);
            })
            this.sceneRunner.addScene("intermediate", intermediateScreen);
            this.sceneRunner.runScene("intermediate");

            if(prevLevel !== currentLevel){
                this.sceneRunner.removeScene(prevLevel);
            }
        }


        const runGame = (event) => {
            if(event.key === "Enter") {
                runLevel('level1');
                window.removeEventListener("keydown", runGame);
            }
        }
        window.addEventListener("keydown", runGame);
        window.runLevel = runLevel;
    }

    update(delta_time) {
        this.gameContext.time = delta_time;
        this.sceneRunner.update(this.gameContext);
    }

    draw() {
        this.sceneRunner.draw(this.display);
    }
}

export default Game

import Controller from "@core/Controller";
import Display from "@core/Display";
import Engine from "@core/Engine";
import Game from "@core/Game";

import {createLevelLoader} from "@/game/loaders/level";
import {loadEntities} from "@/game/entities";
import {loadFont} from "@/game/loaders/font";
import {loadImage} from "@/util/loaders";
import {askUsername} from "@/modal";


    /* * * * *
     * MAIN  *
     * * * * */
async function main() {
    /* * * * * * * * *
     * LOAD CONTENT  *
     * * * * * * * * */
    const [entityFactory, font, startImage] = await Promise.all([
        loadEntities(audioContext),
        loadFont(),
        loadImage('/assets/images/background.png')
    ]);
    const loadLevel = await createLevelLoader(entityFactory);

    /* * * * * * * *
     * INITIALIZE  *
     * * * * * * * */
    game.init(controller, audioContext, font, loadLevel, entityFactory, startImage);

    /* * * *
     * RUN *
     * * * */
    resize();
    engine.start();
}


/* * * * * * * *
 *  FUNCTIONS  *
 * * * * * * * */
let resize = function(event) {
    display.resize(
        document.documentElement.clientWidth - 5,
        document.documentElement.clientHeight - 5,
        80 / 160);
    display.render();
}

let render = function(event) {
    // display game elements at display buffer
    game.draw();
    display.render();
}

let update = function(delta_time) {
    // update game
    game.update(delta_time);
}

let gameover = function(score) {
    console.log("loose", score)
    engine.stop();
    controller.disable();

    askUsername((username) => {
        expandScoreboard(username, score);
        window.location.replace("/");
    })
}

let win = function(score) {
    console.log("win", score)
    engine.stop();
    controller.disable();

    askUsername((username) => {
        expandScoreboard(username, score);
        window.location.replace("/");
    })
}

function expandScoreboard(username, score) {
    let scoreboard = localStorage.getItem("trixie-scoreboard");
    if(scoreboard) {
        scoreboard = JSON.parse(scoreboard);
    } else {
        scoreboard = []
    }

    console.log(scoreboard)

    scoreboard.push({username, score});
    scoreboard.sort((a, b) => b.score - a.score)

    if(scoreboard.length > 10) {
        scoreboard.pop();
    }

    localStorage.setItem("trixie-scoreboard", JSON.stringify(scoreboard));
}


/* * * * * *
 * OBJECTS *
 * * * * * */
const canvas = document.querySelector("canvas");
const audioContext = new AudioContext();

let controller = new Controller(window);
let display = new Display(canvas);
let engine = new Engine(1000/60, update, render);
let game = new Game(display, gameover, win);

window.addEventListener("resize",  resize);

main(canvas).then(() => {
});

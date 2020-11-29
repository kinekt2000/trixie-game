/**
 *
 * @param {Controller} controller
 * @param {Entity} router.route(entity => entity
 */
import {Direction} from "@/game/traits/Go";
import InputRouter from "@/game/InputRouter";

export function setupKeyboard(controller) {
    const router = new InputRouter();

    controller.addKey(
        ["Up", "ArrowUp"],
        "up",
        () => { router.route(entity => entity.jump.start()) },
        () => { router.route(entity => entity.jump.cancel()) }
    );

    controller.addKey(
        ["Shift"],
        "shift",
        () => { router.route(entity => entity.speedUpState(true)) },
        () => { router.route(entity => entity.speedUpState(false))}
    )

    controller.addKey(
        ["z", "Z"],
        "z",
        () => {router.route(entity => entity.melee.attack(entity))}
    )

    controller.addKey(
        ["Right", "ArrowRight"],
        "right",
        () => {router.route(entity => entity.go.setDirection(Direction.RIGHT))},
        () => {router.route(entity => entity.go.removeDirection(Direction.RIGHT))}
    )

    controller.addKey(
        ["Left", "ArrowLeft"],
        "left",
        () => {router.route(entity => entity.go.setDirection(Direction.LEFT))},
        () => {router.route(entity => entity.go.removeDirection(Direction.LEFT))}
    )

    return router;
}

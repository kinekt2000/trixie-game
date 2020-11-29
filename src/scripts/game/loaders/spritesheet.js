import Spritesheet from "@/graphics/Spritesheet";
import {createAnimation} from "@/graphics/animation";
import {loadImage} from "@/util/loaders";

/**
 *
 * @param {{
 * name: string,
 *      tilewidth?: number,
 *      tileheight?: number,
 *      tilecount?: number,
 *      frames?: Array<{name: string, rect: number[4]}>
 *      animations?: Array<{name: string, frameLength: number, repeat: boolean, frames: string[]}>
 * }} sheet_spec Tiled tileset specification
 */
export function loadSpritesheet(sheet_spec) {
    return  Promise.all([
        sheet_spec,
        loadImage(`/assets/images/${sheet_spec.name}.png`)
    ])
        .then(([sheet_spec, image]) => {
            let spritesheet;
            if(sheet_spec.frames) {
                spritesheet = new Spritesheet(image);
                sheet_spec.frames.forEach(frame_spec => {
                    const x = frame_spec.rect[0];
                    const y = frame_spec.rect[1];
                    const width = frame_spec.rect[2];
                    const height = frame_spec.rect[3];

                    spritesheet.define(frame_spec.name, {x, y}, width, height);
                })
            } else {
                spritesheet = new Spritesheet(image, sheet_spec.tilewidth, sheet_spec.tileheight, sheet_spec.tilecount);
            }

            if(sheet_spec.animations) {
                const animations = new Map();
                for (const anim of sheet_spec.animations) {
                    animations.set(anim.name, createAnimation(anim.frames, anim.frameLength, anim.repeat))
                }
                spritesheet.animations = animations
            }
            return spritesheet;
        })
}

import {loadImage} from "@/util/loaders";
import Spritesheet from "@/graphics/Spritesheet";
import {Vector2} from "@/util/math";

// noinspection SpellCheckingInspection
const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

class Font {
    constructor(spritesheet) {
        this.sprites = spritesheet;
    }

    get size() {
        return new Vector2(this.sprites.width, this.sprites.height);
    }

    print(text, context, x, y) {
        [...text].forEach((char, pos) => {
            this.sprites.draw(char, context,  x + pos * this.sprites.width, y)
        })
    }
}

export function loadFont() {
    return loadImage("/assets/images/font.png")
        .then(image => {
            const fontSprite = new Spritesheet(image, 8, 8, 16 * 6);
            fontSprite.ignoreSize();

            for(let [index, char] of [...CHARS].entries()) {
                fontSprite.define(char, index);
            }

            return new Font(fontSprite);
        })
}

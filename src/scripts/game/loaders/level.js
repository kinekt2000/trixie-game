import {Matrix, Vector2} from "@/util/math";
import {loadJSON} from "@/util/loaders";

import {Level} from "@/game/Level";
import {loadSpritesheet} from "@/game/loaders/spritesheet";
import {createStaticLayer} from "@/graphics/layers/static";
import {createDynamicLayer} from "@/graphics/layers/dynamic";
import {loadMusicSheet} from "@/game/loaders/music";
import Entity from "@/game/Entity";
import LevelTimer from "@/game/traits/LevelTimer";
import Trigger, {createGenericCondition} from "@/game/traits/Trigger";

/**
 *
 * @param {Level} level
 * @param {{data: number[], width: number, height: number}[]} level_layers Tile layers of level file
 */
function createTiles(level, level_layers) {
    let width = 0;
    let height = 0;

    level_layers.forEach((layer, i) => {
        level.tiles[i] = new Matrix();

        if(layer.width > width) width = layer.width;
        if(layer.height > height) height = layer.height;

        for(let x = 0; x < layer.width; x++) {
            for(let y = 0; y < layer.height; y++) {
                const index = y * layer.width + x;
                if(layer.data[index]) {
                    level.tiles[i].set(x, y, {
                        id: layer.data[index] - 1
                    })
                }
            }
        }
    })

    return [width, height];
}

/**
 *
 * @param {Level} level
 * @param {{objects: {name: string, type: string, x: number, y: number, width: number, height: number}[]}[]} level_layers Layers of level file
 * @param {Vector2} tile_size
 */
function createPhysicsMap(level, level_layers, tile_size) {
    const tileResolver = level.tileCollider.tiles;
    tileResolver.tileSize = tile_size;

    level_layers.forEach(layer => {
        layer.objects.forEach(object => {
            const rangeX = tileResolver.toIndexRangeX(object.x, object.x + object.width);
            const rangeY = tileResolver.toIndexRangeY(object.y, object.y + object.height);

            rangeX.forEach(x => {
                rangeY.forEach(y => {
                    level.physicalMap.set(x, y, {
                        type: object.type
                    })
                })
            })
        })
    })
}

function setupCollisions(level_spec, level, sprites) {
    const object_layers = level_spec.layers.filter(layer => layer.type === "objectgroup")
    const static_objects = object_layers.filter(layer => layer.name === "static_objects");
    createPhysicsMap(level, static_objects, new Vector2(sprites.width, sprites.height));
}

function setupBackground(level_spec, level, sprites) {
    const tile_layers = level_spec.layers.filter(layer => layer.type === "tilelayer")
    const [width, height] = createTiles(level, tile_layers);
    level.size.set(
        width * sprites.width,
        height * sprites.height
    )

    level.tileSize.set(sprites.width, sprites.height);
    level.staticLayerController.layers.push(createStaticLayer(level, sprites));
}

function setupEntities(level_spec, level, entity_factory) {
    const entities = level_spec.layers.find(layer => layer.name === "entities").objects;
    entities.forEach(entity_spec => {
        const name = entity_spec.name;
        const x = entity_spec.x;
        const y = entity_spec.y;

        const createEntity = entity_factory[name];
        const entity = createEntity();

        entity.bounds.bottom = y;
        entity.bounds.left = x - entity.size.x/2;

        level.entities.add(entity)
    })
    level.dynamicLayerController.layers.push(createDynamicLayer(level.entities, 64, 64));
}

function setupPlayer(level_spec, entity_factory) {
    const playerSpec = level_spec.layers.find(layer => layer.name === "player").objects.find(object => object.type === "init");

    if(playerSpec) {
        let player = entity_factory.player();
        player.bounds.bottom = playerSpec.y;
        player.bounds.left = playerSpec.x;

        return player;

    }
    return undefined;
}


function createTimer() {
    const timer = new Entity('levelTimer');
    timer.addTrait(new LevelTimer());
    return timer;
}

function setupBehavior(level) {
    const timer = createTimer();
    level.entities.add(timer);


    level.events.listen(LevelTimer.EVENT_TIMER_OK, () => {
        level.music.playTheme();
    })

    level.events.listen(LevelTimer.EVENT_TIMER_HURRY, () => {
        level.music.playHurryTheme();
    })
}


function setupCoins(level_spec, level, entity_factory) {
    const coinsSpec = level_spec.layers.find(layer => layer.name === "coins");
    if(!coinsSpec) {
        return
    }

    coinsSpec.objects.forEach(coin_spec => {
        const name = coin_spec.name;
        const x = coin_spec.x;
        const y = coin_spec.y;

        const createCoin = entity_factory[name];
        const coin = createCoin();

        coin.bounds.top = y - coin.size.y/2;
        coin.bounds.left = x - coin.size.x/2;

        level.entities.add(coin)
    })
}


function createTrigger() {
    const trigger = new Entity('trigger');
    trigger.addTrait(new Trigger());
    return trigger;
}

function setupTriggers(level_spec, level) {
    const triggersSpec = level_spec.layers.find(layer => layer.name === "triggers");
    if(!triggersSpec) {
        return;
    }

    for(const triggerSpec of triggersSpec.objects) {
        const entity = createTrigger()
        const trigger = entity.trigger;

        trigger.conditions.push((trigger, targets, game_context, level) => {
            level.events.emit(Level.EVENT_TRIGGER, triggerSpec, targets)
        })

        entity.pos.set(triggerSpec.x, triggerSpec.y)
        entity.size.set(triggerSpec.width, triggerSpec.height);

        level.entities.add(entity);
    }

}


// assemble level using tileset and level file
export function createLevelLoader(entity_factory) {
    return function loadLevel(name) {
        return loadJSON(`/assets/levels/${name}.json`)
            .then(level_spec => Promise.all([
                level_spec,
                loadSpritesheet(level_spec.tilesets[0]),
                loadMusicSheet(level_spec.properties.find(property => property.name === 'music').value)
            ]))
            .then(([level_spec, sprites, music_player]) => {
                // get tile layers fro level file
                const level = new Level();
                level.music.setPlayer(music_player);

                setupBackground(level_spec, level, sprites);
                setupCollisions(level_spec, level, sprites);
                setupEntities(level_spec, level, entity_factory);
                setupCoins(level_spec, level, entity_factory);
                setupTriggers(level_spec, level)
                setupBehavior(level)

                level.width = level.physicalMap.size.x;
                level.height = level.physicalMap.size.y;

                const player = setupPlayer(level_spec, entity_factory);

                return [level, player];
            })
    }
}

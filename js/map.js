import {Floor, Wall} from "./texture.js";

export class Map {
    constructor(settings, util) {
        this.util = util;

        const textures = this.initMap(settings);

        // Methods
        this.getTextures = () => textures;
        this.getTextureByPosition = (x, y) => textures.find(t => t.matchWithPosition(x, y));
    }

    initMap(settings) {
        const textures = [];
        const count = settings.getCount();
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const texture = this.initTexture(i, j, count);
                textures.push(texture);
            }
        }

        return textures;
    }

    initTexture(x, y, count) {
        const coords = { x, y };
        // TODO: decide
        const isWall = Math.random() < 0.3 || !this.inBounds(x, y, count);
        return isWall ? new Wall(coords) : new Floor(coords);
    }

    inBounds(x, y, count) {
        return x > 0 && y > 0 && x < count - 1 && y < count - 1;
    }


    // todo: edit
   /* getTile(x, y) {
        return this.inBounds(x, y) ? this.tiles[x][y] : new Wall({ x, y });
    }*/


    /*randomPassableTile() {
        let tile;
        this.util.tryTo('get random passable tile', () => {
            let x = this.util.randomRange(0, this.settings.numTiles - 1);
            let y = this.util.randomRange(0, this.settings.numTiles - 1);
            tile = this.getTile(x, y);
            // return tile.getPassable() && !tile.monster;
            return tile.getPassable();
        });
        return tile;
    }*/
}

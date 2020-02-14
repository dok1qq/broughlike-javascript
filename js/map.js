import {Wall} from "./tile.js";
import {Floor} from "./tile.js";

export class Map {
    constructor(settings, util) {
        this.settings = settings;
        this.util = util;

        this.tiles = [];

        this.generateLevel();
    }

    generateLevel() {
        this.generateTiles();
    }

    generateTiles() {
        for (let i = 0; i < this.settings.numTiles; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.settings.numTiles; j++) {
                this.tiles[i][j] = (Math.random() < 0.3 || !this.inBounds(i, j))
                    ? new Wall(i, j)
                    : new Floor(i, j);
            }
        }
    }

    inBounds(x, y) {
        return x > 0 && y > 0 && x < this.settings.numTiles - 1 && y < this.settings.numTiles - 1;
    }

    getTile(x, y) {
        return this.inBounds(x, y) ? this.tiles[x][y] : new Wall(x, y);
    }


    randomPassableTile() {
        let tile;
        this.util.tryTo('get random passable tile', () => {
            let x = this.util.randomRange(0, this.settings.numTiles - 1);
            let y = this.util.randomRange(0, this.settings.numTiles - 1);
            tile = this.getTile(x, y);
            return tile.passable && !tile.monster;
        });
        return tile;
    }
}

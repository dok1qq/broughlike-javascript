import {Floor, Wall, Exit} from "./texture.js";
import {Util} from "./util.js";

export class Map {
    constructor(settings) {
        this.textures = [];
        this.texturesMap = [];

        // Methods
        this.getTextures = () => this.textures;
        this.getTextureByPosition = (x, y) => {
            // return this.textures.find(t => t.matchWithPosition(x, y));
            return this.texturesMap[x][y] || undefined;
        };

        this.randomPassableTexture = () => {
            return Util.tryTo('get random passable tile', () => {
                const x = Util.randomRange(0, settings.getCount() - 1);
                const y = Util.randomRange(0, settings.getCount() - 1);
                const t = this.getTextureByPosition(x, y);
                return t && t.canPass() && !t.getMonster() ? t : null;
            });
        };

        this.initTextures(settings);
    }

    initTextures(settings) {
        const count = settings.getCount();
        for (let i = 0; i < count; i++) {
            this.texturesMap[i] = [];
            for (let j = 0; j < count; j++) {
                const texture = this.initTexture(i, j, count);
                this.textures.push(texture);
                this.texturesMap[i][j] = texture;
            }
        }

        // Init Exit
        const exitTexture = this.randomPassableTexture();
        const exit = new Exit({x: exitTexture.getX(), y: exitTexture.getY()});

        const index = this.textures.findIndex(t => t.getX() === exit.getX() && t.getY() === exit.getY());
        this.textures.splice(index, 1, exit);
        this.texturesMap[exitTexture.getX()][exitTexture.getY()] = exit;

    }

    initTexture(x, y, count) {
        const coords = { x, y };

        if (this.isFence(x, y, count)) {
            return new Wall(coords);
        }

        // TODO: make algorithm
        return Math.random() < 0.2 ? new Wall(coords) : new Floor(coords);
    }

    /**
     * 0 < x < count
     *
     * W | W | W | W
     * W | F | F | W
     * W | F | F | W
     * W | W | W | W
     */
    isFence(x, y, count) {
        const isInside = x > 0 && y > 0 && x < count - 1 && y < count - 1;
        return !isInside;
    }

    getNeighbors(tile) {
        const x = tile.getX();
        const y = tile.getY();
        return [
            this.texturesMap[x][y - 1],
            this.texturesMap[x][y + 1],
            this.texturesMap[x - 1][y],
            this.texturesMap[x + 1][y],
        ].filter(t => t.canPass());
    }
}

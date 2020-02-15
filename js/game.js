import {Map} from "./map.js";
import {Renderer} from "./renderer.js";
import {SpriteSheet} from "./sprite-sheet.js";
import {Hero} from "./texture.js";

export class Game {
    constructor(settings, path) {
        const spriteSheet = new SpriteSheet(path, 16);

        this.map = new Map(settings, null, spriteSheet);
        this.hero = new Hero({x: 0, y: 0});
        this.renderer = new Renderer(settings, spriteSheet);

        this.draw();
    }

    draw() {
        this.renderer.clear();

        const tiles = this.map.getTextures();
        const tilesLength = tiles.length;
        for (let i = 0; i < tilesLength; i++) {
            this.renderer.draw(tiles[i]);
        }

        // Draw player
        this.renderer.draw(this.hero);
    }

    update(key) {

        const isUp = key === 'w';
        const isDown = key === 's';
        const isLeft = key === 'a';
        const isRight = key === 'd';

        const currentPosition = {
            x: this.hero.getX(),
            y: this.hero.getY(),
        };

        if (isUp) {
            const nextX = currentPosition.x;
            const nextY = this.hero.getY() - 1;
            if (this.canMoveToNextPosition(nextX, nextY)) {
                this.hero.setY(nextY);
            }
        }

        if (isDown) {
            const nextX = currentPosition.x;
            const nextY = this.hero.getY() + 1;
            if (this.canMoveToNextPosition(nextX, nextY)) {
                this.hero.setY(nextY);
            }
        }

        if (isLeft) {
            const nextX = this.hero.getX() - 1;
            const nextY = currentPosition.y;
            if (this.canMoveToNextPosition(nextX, nextY)) {
                this.hero.setX(nextX);
            }
        }

        if (isRight) {
            const nextX = this.hero.getX() + 1;
            const nextY = currentPosition.y;
            if (this.canMoveToNextPosition(nextX, nextY)) {
                this.hero.setX(nextX);
            }
        }
    }

    canMoveToNextPosition(x, y) {
        const texture = this.map.getTextureByPosition(x, y);
        return texture && texture.canPass() || false;
    }
}

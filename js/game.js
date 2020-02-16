import {Map} from "./map.js";
import {Renderer} from "./renderer.js";
import {SpriteSheet} from "./sprite-sheet.js";
import {Bird, Hero} from "./monster.js";

export class Game {
    constructor(settings, path) {
        const spriteSheet = new SpriteSheet(path, 16);

        // Init map
        this.map = new Map(settings);

        // Init hero
        const startTexture = this.map.randomPassableTexture();
        this.hero = new Hero(startTexture);

        // Init monsters
        // TODO: number depend from level
        this.monsters = [];
        const birdPosition = this.map.randomPassableTexture();

        const bird = new Bird(birdPosition, this.hero);
        this.monsters.push(bird);

        /*setInterval(() => {
            const bird = this.monsters[0];
            const neighbors = this.map.getNeighbors(bird.getCurrentTile());
            bird.update(neighbors);
            this.draw();
        }, 1000);*/


        // Init other stuff




        // Render things
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

        const monstersLength = this.monsters.length;
        for (let i = 0; i < monstersLength; i++) {
            this.renderer.draw(this.monsters[i]);
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
            this.updateHeroPosition(currentPosition.x, this.hero.getY() - 1);
        }

        if (isDown) {
            this.updateHeroPosition(currentPosition.x, this.hero.getY() + 1);
        }

        if (isLeft) {
            this.updateHeroPosition(this.hero.getX() - 1, currentPosition.y);
        }

        if (isRight) {
            this.updateHeroPosition(this.hero.getX() + 1, currentPosition.y);
        }

        // Monsters step
        const bird = this.monsters[0];
        const neighbors = this.map.getNeighbors(bird.getCurrentTile());
        bird.update(neighbors);
        // bird.tryMove(this.map.getTextureByPosition(x, y))
    }

    updateHeroPosition(x, y) {
        const nextTile = this.getNextPosition(x, y);
        if (nextTile) {
            this.hero.tryMove(nextTile);
        }
    }

    getNextPosition(x, y) {
        const t = this.map.getTextureByPosition(x, y);
        return t && t.canPass() ? t : null;
    }
}

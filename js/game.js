import {Map} from "./map.js";
import {Renderer} from "./renderer.js";
import {SpriteSheet} from "./sprite-sheet.js";
import {Hero, getRandomMonster} from "./monster.js";
import {Util} from "./util.js";

export class Game {
    constructor(settings, path, level) {
        const spriteSheet = new SpriteSheet(path, 16);

        // Init map
        this.map = new Map(settings);

        // Init hero
        const startTexture = this.map.randomPassableTexture();
        this.hero = new Hero(startTexture);

        // Init monsters
        this.initMonsters(level);


        // Render things
        this.renderer = new Renderer(settings, spriteSheet);
        this.draw();
    }

    initMonsters(level) {
        this.monsters = [];

        // Maybe need only level + 1
        const monstersCount = Util.randomRange(1, level + 1);
        for (let i = 0; i < monstersCount; i++) {
            const freePoint = this.map.randomPassableTexture();
            const monster = getRandomMonster();
            this.monsters.push(new monster(freePoint, this.hero));
        }
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
        this.tick();
    }

    /**
     * Monsters update function
     */
    tick() {
        for (let k = this.monsters.length - 1; k>=0 ; k--) {
            const monster = this.monsters[k];

            if (monster.isDead()){
                this.monsters.splice(k,1);
            } else {
                const neighbors = this.map.getNeighbors(monster.getCurrentTile());
                monster.update(neighbors);
            }
        }
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

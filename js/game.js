import {Map} from "./map.js";
import {Renderer} from "./renderer.js";
import {Hero, getRandomMonster} from "./monster.js";
import {Util} from "./util.js";
import {Hp} from "./texture.js";

export class Game {
    constructor(settings, spriteSheet) {
        this.spawnRate = 15;
        this.spawnCounter = this.spawnRate;
        this.settings = settings;
        this.renderer = new Renderer(settings, spriteSheet);

        spriteSheet.onLoad(this.showTitle.bind(this));

        this.gameState = 'loading';
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

    spawnMonster() {
        const freePoint = this.map.randomPassableTexture();
        const monster = getRandomMonster();
        this.monsters.push(new monster(freePoint, this.hero));
    }

    draw() {
        if (this.gameState === 'title') {
            return;
        }

        this.renderer.clear();

        const tiles = this.map.getTextures();
        const tilesLength = tiles.length;
        for (let i = 0; i < tilesLength; i++) {
            this.renderer.draw(tiles[i]);
        }

        const monstersLength = this.monsters.length;
        for (let i = 0; i < monstersLength; i++) {
            this.renderer.draw(this.monsters[i]);
            this.drawHp(this.monsters[i])
        }

        // Draw player
        this.renderer.draw(this.hero);
        this.drawHp(this.hero);
    }

    drawHp(monster) {
        const count = monster.getHp();
        for (let i = 0; i < count; i++) {
            this.hpTexture.update(monster, i);
            this.renderer.draw(this.hpTexture);
        }
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
                // TODO: bad stuff
                monster.doStuff(this.map.getNeighbors.bind(this.map));
            }
        }

        if(this.hero.dead){
            this.gameState = 'dead';
        }

        this.spawnCounter--;
        if (this.spawnCounter <= 0){
            this.spawnMonster();
            this.spawnCounter = this.spawnRate;
            this.spawnRate--;
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

    startGame(level, startingHp, numLevels) {
        this.startLevel(startingHp, level);

        this.gameState = 'running';
    }

    showTitle() {
        this.renderer.drawInfo();
        this.gameState = 'title';
    }

    startLevel(playerHp, level) {
        // Init map
        this.map = new Map(this.settings);

        // Init hero
        const startTexture = this.map.randomPassableTexture();
        this.hero = new Hero(startTexture);
        this.hero.hp = playerHp;

        // Init hp
        this.hpTexture = new Hp({x: 0, y: 0});

        // Init monsters
        this.initMonsters(level);

        // Render things
        this.draw();
    }
}

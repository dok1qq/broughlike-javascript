import {Map} from "./map.js";
import {Renderer} from "./renderer.js";
import {Hero, getRandomMonster} from "./monster.js";
import {Util} from "./util.js";
import {Hp, Teleport, Treasure} from "./texture.js";
import {spells} from "./spell.js";

export class Game {
    constructor(settings, spriteSheet, level, playerHp, numLevels) {
        this.playerHp = playerHp;
        this.level = level;
        this.numLevels = numLevels;
        this.numSpells = 1;
        this.spawnRate = 15;
        this.spawnCounter = this.spawnRate;
        this.settings = settings;
        this.renderer = new Renderer(settings, spriteSheet);
        this.monsters = [];
        this.score = 0;

        spriteSheet.onLoad(this.showTitle.bind(this));

        this.gameState = 'loading';
    }

    initMonsters() {
        this.monsters = [];

        // Maybe need only level + 1
        const monstersCount = Util.randomRange(1, this.level);
        console.log(this.level, ' | ', monstersCount);
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

            if (tiles[i].treasure) {
                this.treasureTexture.update(tiles[i]);
                this.renderer.draw(this.treasureTexture);
            }
        }

        const monstersLength = this.monsters.length;
        for (let i = 0; i < monstersLength; i++) {
            const monster = this.monsters[i];
            if (monster.getTeleportCounter() > 0) {
                this.teleportTexture.update(monster);
                this.renderer.draw(this.teleportTexture);
                continue;
            }

            this.renderer.draw(monster);
            this.drawHp(monster);

            // Update monster animate position
            // monster.offsetX -= Math.sign(monster.offsetX) * (1/8);
            // monster.offsetY -= Math.sign(monster.offsetY) * (1/8);
        }

        // Draw player
        this.renderer.draw(this.hero);
        this.drawHp(this.hero);

        // Game info
        this.renderer.drawText(`Level: ${this.level}`, 30, false, 40, 'violet');
        this.renderer.drawText(`Score: ${this.score}`, 30, false, 70, 'violet');

        for (let i=0; i < this.hero.spells.length; i++) {
            const spellText = `${i+1}) ${this.hero.spells[i]}`;
            this.renderer.drawText(spellText, 20, false, 110 + i * 40, "aqua");
        }
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
        const isSpell = key >= 1 && key <= 9;

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

        if (isSpell) {
            this.useSpell();
        }

        // Monsters step
        this.tick();


        // Collect treasure
        if (this.hero.currentTile.treasure) {
            this.score++;
            this.hero.currentTile.treasure = false;
            this.spawnMonster();

            // Add spells
            if(this.score % 3 === 0 && this.numSpells < 9){
                this.numSpells++;
                this.hero.addSpell();
            }
        }

        // Check next level or end game
        if (this.hero.teleported) {
            if (this.level === this.numLevels) {
                addScore(this.score, true);
                this.showTitle();
            } else {
                this.level++;
                this.startLevel();
            }
        }
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
            addScore(this.score, false);
            this.gameState = 'dead';
        }

        this.spawnCounter--;
        if (this.spawnCounter <= 0) {
            this.spawnMonster();
            this.spawnCounter = this.spawnRate;
            this.spawnRate--;
        }
    }

    useSpell() {
        const goal = this.map.randomPassableTexture();
        spells.WOOP(this.hero, goal);
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

    startGame() {
        this.startLevel();

        this.score = 0;
        this.gameState = 'running';
    }

    showTitle() {
        this.renderer.drawInfo();
        this.gameState = 'title';

        this.renderer.drawText("SUPER", 40, true, 300, "white");
        this.renderer.drawText("BROUGH BROS.", 70, true, 150, "white");

        this.drawScores();
    }

    startLevel() {
        // Init map
        this.map = new Map(this.settings);

        // Init hero
        const startTexture = this.map.randomPassableTexture();
        this.hero = new Hero(startTexture);
        this.hero.hp = this.playerHp;

        // Init hp
        this.hpTexture = new Hp({x: 0, y: 0});

        // Init teleport Texture
        this.teleportTexture = new Teleport({x: 0, y: 0});

        // Init treasure
        this.treasureTexture = new Treasure({x: 0, y: 0});

        // Init monsters
        this.initMonsters();

        // Render things
        this.draw();
    }

    drawScores() {
        let scores = getScores();
        if (scores.length) {
            this.renderer.drawText(
                this.rightPad(["RUN","SCORE","TOTAL"]),
                18,
                true,
                350,
                "white"
            );

            const newestScore = scores.pop();
            scores.sort(function(a,b){
                return b.totalScore - a.totalScore;
            });
            scores.unshift(newestScore);

            for (let i=0; i < Math.min(10,scores.length); i++) {
                const scoreText = this.rightPad([scores[i].run, scores[i].score, scores[i].totalScore]);
                this.renderer.drawText(
                    scoreText,
                    18,
                    true,
                    350 + 24 + i * 24,
                    i === 0 ? "aqua" : "violet"
                );
            }
        }
    }

    rightPad (textArray) {
        let finalText = "";
        textArray.forEach(text => {
            text += "";
            for(let i=text.length;i<10;i++){
                text += " ";
            }
            finalText += text;
        });
        return finalText;
    }
}


// TODO: scored stuff in Score class
function getScores(){
    if ( localStorage["scores"]) {
        return JSON.parse(localStorage["scores"]);
    } else {
        return [];
    }
}

function addScore(score, won){
    const scores = getScores();
    const scoreObject = { score, run: 1, totalScore: score, active: won };
    const lastScore = scores.pop();

    if (lastScore) {
        if (lastScore.active) {
            scoreObject.run = lastScore.run + 1;
            scoreObject.totalScore += lastScore.totalScore;
        } else {
            scores.push(lastScore);
        }
    }
    scores.push(scoreObject);

    localStorage["scores"] = JSON.stringify(scores);
}

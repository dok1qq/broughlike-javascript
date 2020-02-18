import {Texture} from "./texture.js";
import {Util} from "./util.js";

export class Monster extends Texture {
    constructor(tile, sprite, hp, player) {
        super({ x: tile.getX(), y: tile.getY() }, sprite, true);
        this.currentTile = null;
        this.player = player;
        this.dead = false;
        this.hp = hp;
        this.isHero = false;

        this.move(tile);

        this.getX = () => this.currentTile.getX();
        this.getY = () => this.currentTile.getY();
    }

    getPlayer() {
        return this.player;
    }

    isDead() {
        return this.dead;
    }

    getCurrentTile() {
        return this.currentTile;
    }

    getHp() {
        return this.hp;
    }

    tryMove(tile){
        if (!tile.canPass()){
            return false;
        }

        if (!tile.getMonster()){
            this.move(tile);
        }

        if (this.isHero !== tile.getMonster().isHero) {
            tile.getMonster().hit(1);
        }

        return true;
    }

    move(tile){
        if (this.currentTile){
            this.currentTile.setMonster(null);
        }

        this.currentTile = tile;
        tile.setMonster(this);
    }

    update(neighbors) {
        if (!this.currentTile) {
            return;
        }

        if (!neighbors.length) {
            return;
        }

        const first = neighbors.length === 1
            ? neighbors[0]
            : neighbors.sort((a,b) => {
                const aDist = a.dist(this.player.getCurrentTile());
                const bDist = b.dist(this.player.getCurrentTile());
                return aDist - bDist;
            })[0];

        this.tryMove(first);
    }

    hit(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.dead = true;
        this.currentTile.setMonster(null);
        this.setSprite(1);
    }
}

export class Hero extends Monster {
    constructor(tile) {
        super(tile, 0, 3, null);
        this.isHero = true;
    }
}

export class Bird extends Monster {
    constructor(tile, player) {
        super(tile, 4, 3, player);
    }
}

export class Snake extends Monster {
    constructor(tile, player) {
        super(tile, 5, 1, player);
    }
}

export class Tank extends Monster {
    constructor(tile, player) {
        super(tile, 6, 2, player);
    }
}

export class Eater extends Monster {
    constructor(tile, player) {
        super(tile, 7, 1, player);
    }
}

export class Jester extends Monster {
    constructor(tile, player){
        super(tile, 8, 2, player);
    }
}

const MONSTERS = [Bird, Snake, Tank, Eater, Jester];

export function getRandomMonster() {
    return Util.shuffle(MONSTERS).pop();
}

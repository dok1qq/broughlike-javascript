import {Texture} from "./texture.js";
import {Util} from "./util.js";

export class Monster extends Texture {
    constructor(tile, sprite, hp, player) {
        super({ x: tile.getX(), y: tile.getY() }, sprite, false);
        this.currentTile = null;
        this.player = player;
        this.dead = false;
        this.hp = hp;
        this.move(tile);

        this.getX = () => this.currentTile.getX();
        this.getY = () => this.currentTile.getY();
    }

    isDead() {
        return this.dead;
    }

    getCurrentTile() {
        return this.currentTile;
    }

    tryMove(tile){
        if (!tile.canPass()){
            return false;
        }

        if(!tile.getMonster()){
            this.move(tile);
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

    getHp() {
        return this.hp;
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
}

export class Hero extends Monster {
    constructor(tile) {
        super(tile, 0, 3);
        this.setPlayer(this);
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

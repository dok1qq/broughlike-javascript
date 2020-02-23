import {Texture} from "./texture.js";
import {Util} from "./util.js";

export class Monster extends Texture {
    constructor(tile, sprite, hp, player) {
        super({ x: tile.getX(), y: tile.getY() }, sprite, true);
        // Game monster main stuff
        this.currentTile = null;
        this.player = player;
        this.dead = false;
        this.hp = hp;
        this.isHero = false;

        // Features
        this.attackedThisTurn = false;
        this.stunned = false;

        // Teleport
        this.teleportCounter = 2;

        // Animation
        this.offsetX = 0;
        this.offsetY = 0;

        this.move(tile);

        this.getX = () => this.currentTile.getX();
        this.getY = () => this.currentTile.getY();
    }

    getTeleportCounter() {
        return this.teleportCounter
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

    getDisplayX(){
        return this.currentTile.getX() + this.offsetX;
    }

    getDisplayY(){
        return this.currentTile.getY() + this.offsetY;
    }

    tryMove(tile) {
        if (!tile.canPass()){
            return false;
        }

        if (!tile.getMonster()){
            this.move(tile);
        }

        if (this.isHero !== tile.getMonster().isHero) {
            this.attackedThisTurn = true;
            // tile.getMonster().stunned = true;
            tile.getMonster().hit(1);

            this.offsetX = (tile.getX() - this.currentTile.getX()) / 2;
            this.offsetY = (tile.getY() - this.currentTile.getY()) / 2;
        }

        return true;
    }

    move(tile) {
        if (this.currentTile){
            this.currentTile.setMonster(null);
            this.offsetX = this.currentTile.getX() - tile.getX();
            this.offsetY = this.currentTile.getY() - tile.getY();
        }

        this.currentTile = tile;
        tile.setMonster(this);
        tile.stepOn(this);
    }

    // TODO: don't know yet how to avoid it
    doStuff(getNeighborsFn) {
        const neighbors = getNeighborsFn(this.getCurrentTile());
        this.update(neighbors);
    }

    update(neighbors) {
        this.teleportCounter--;

        if (this.stunned || this.teleportCounter > 0) {
            this.stunned = false;
            return;
        }

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
        this.teleportCounter = 0;
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

    doStuff(getNeighborsFn) {
        this.attackedThisTurn = false;
        super.doStuff(getNeighborsFn);

        if (!this.attackedThisTurn) {
            super.doStuff(getNeighborsFn)
        }
    }
}

export class Tank extends Monster {
    constructor(tile, player) {
        super(tile, 6, 2, player);
    }

    update(neighbors) {
        const startedStunned = this.stunned;
        super.update(neighbors);
        if(!startedStunned){
            this.stunned = true;
        }
    }
}

export class Eater extends Monster {
    constructor(tile, player) {
        super(tile, 7, 1, player);
    }

    /*doStuff(getNeighborsFn) {
        this.attackedThisTurn = false;
        super.doStuff(getNeighborsFn);

        if (!this.attackedThisTurn) {
            super.doStuff(getNeighborsFn)
        }
    }*/
}

export class Jester extends Monster {
    constructor(tile, player){
        super(tile, 8, 2, player);
    }

    doStuff(getNeighborsFn) {
        const neighbors = getNeighborsFn(this.getCurrentTile());

        if (neighbors.length) {
            const shuffled = Util.shuffle(neighbors);
            this.update(shuffled);
        }
    }

    update(neighbors) {
        this.teleportCounter--;

        if (this.stunned || this.teleportCounter > 0) {
            this.stunned = false;
            return;
        }

        if (!this.currentTile) {
            return;
        }

        if (!neighbors.length) {
            return;
        }

        this.tryMove(neighbors[0]);
    }
}

const MONSTERS = [Bird, Snake, Tank, Eater, Jester];

export function getRandomMonster() {
    return Util.shuffle(MONSTERS)[0];
}

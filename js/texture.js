import {Coordinate} from "./coordinate.js";

export class Texture extends Coordinate {
    constructor(coords, sprite, passable) {
        super(coords);

        let monster = null;
        let player = null;

        this.setMonster = (value) => monster = value;
        this.getMonster = () => monster;

        this.setPlayer = (value) => player = value;
        this.getPlayer = () => player;

        this.getSprite = () => sprite;
        this.canPass = () => passable && !monster && !player;
    }

    dist(goal) {
        const dx = Math.abs(this.getX() - goal.getX());
        const dy = Math.abs(this.getY() - goal.getY());
        return dx + dy;
    }
}

export class Wall extends Texture {
    constructor(coords) {
        super(coords, 3, false);
    }
}

export class Floor extends Texture {
    constructor(coords) {
        super(coords, 2, true);
    }
}

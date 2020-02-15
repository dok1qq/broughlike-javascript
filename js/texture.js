import {Coordinate} from "./coordinate.js";

export class Texture extends Coordinate {
    constructor(coords, sprite, passable) {
        super(coords);

        this.getSprite = () => sprite;
        this.canPass = () => passable;
    }

    matchWithPosition(x, y) {
        return this.getX() === x && this.getY() === y;
    }
}

export class Hero extends Texture {
    constructor(coords) {
        super(coords, 0, false);
    }
}

export class Wall extends Texture {
    constructor(coords) {
        super(coords, 3, true);
    }
}

export class Floor extends Texture {
    constructor(coords) {
        super(coords, 2, false);
    }
}

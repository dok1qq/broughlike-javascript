export class Tile {
    constructor(x, y, sprite, passable) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
    }

    getSprite() {
        return this.sprite;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

export class Floor extends Tile {
    constructor(x, y) {
        super(x, y, 2, true);
    }
}

export class Wall extends Tile {
    constructor(x, y) {
        super(x, y, 3, false);
    }
}

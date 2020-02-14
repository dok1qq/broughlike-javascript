export class Tile {
    constructor({x, y, sprite, passable}) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
    }

    draw() {
        // this.game.drawSprite(this.sprite, this.x, this.y);
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
        super({x, y, sprite: 2, passable: true});
    }
}

export class Wall extends Tile {
    constructor(x, y) {
        super({x, y, sprite: 3, passable: false});
    }
}

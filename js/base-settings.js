export class BaseSettings {
    constructor() {
        this.tileSize = 64;
        this.numTiles = 9;
        this.uiWidth = 4;
        this.x = 0;
        this.y = 0;
        this.spritesheet = new Image();
        this.spritesheet.src = 'spritesheet.png';
    }

    setX(number) {
        this.x = number;
    }

    setY(number) {
        this.y = number;
    }
}

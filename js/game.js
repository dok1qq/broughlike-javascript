export class Game {
    constructor(settings, map) {
        this.settings = settings;
        this.map = map;
        this.setCanvas();
        this.draw();
    }

    setCanvas() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.settings.tileSize * (this.settings.numTiles + this.settings.uiWidth);
        this.canvas.height = this.settings.tileSize * this.settings.numTiles;
        this.canvas.style.width = this.canvas.width + 'px';
        this.canvas.style.height = this.canvas.height + 'px';
        this.ctx.imageSmoothingEnabled = false;
    }

    drawSprite(sprite, x, y) {
        const settings = this.settings;
        this.ctx.drawImage(
            settings.spritesheet,
            sprite * 16,
            0,
            16,
            16,
            x * settings.tileSize,
            y * settings.tileSize,
            settings.tileSize,
            settings.tileSize
        )
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.settings.numTiles; i++) {
            for (let j = 0; j < this.settings.numTiles; j++) {
                const tile = this.map.getTile(i, j);
                this.drawTile(tile);
            }
        }

        this.drawSprite(0, this.settings.x, this.settings.y)
    }

    drawTile(tile) {
        this.drawSprite(tile.getSprite(), tile.getX(), tile.getY());
    }
}

export class Settings {
    constructor(count, uiWidth, tileSize) {
        this.getCount = () => count;
        this.getUiWidth = () => uiWidth;
        this.getTileSize = () => tileSize;

        this.getWidth = () => this.getTileSize() * (this.getCount() + this.getUiWidth());
        this.getHeight = () => this.getTileSize() * this.getCount();
    }
}

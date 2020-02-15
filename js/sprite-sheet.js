export class SpriteSheet {
    constructor(path, size) {
        const image = new Image();
        image.src = path;

        this.getImage = () => image;
        this.sx = (offsetX) => offsetX * size;
        this.sy = () => 0; // Always on top
        this.sWidth = () => size;
        this.sHeight = () => size;
    }
}

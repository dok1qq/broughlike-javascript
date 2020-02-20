export class Renderer {

    constructor(settings, spriteSheet) {
        const context = this.init('canvas', '2d', settings);

        // Methods
        this.clear = () => {
            context.clearRect(0, 0, settings.getWidth(), settings.getHeight());
        };

        this.draw = (tile) => {
            const image = spriteSheet.getImage();
            const sx = spriteSheet.sx(tile.getSprite());
            const sy = spriteSheet.sy();
            const sw = spriteSheet.sWidth();
            const sh = spriteSheet.sHeight();
            const dx = tile.getX() * settings.getTileSize();
            const dy = tile.getY() * settings.getTileSize();
            const dw = settings.getTileSize();
            const dh = settings.getTileSize();
            context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        };

        this.drawInfo = () => {
            context.fillStyle = 'rgba(0, 0, 0, .75)';
            context.fillRect(0,0, settings.getWidth(), settings.getHeight());
        }
    }

    init(name, contextId, settings) {
        const element = document.querySelector(name);
        const context = element.getContext(contextId);
        context.imageSmoothingEnabled = false;

        element.width = settings.getWidth();
        element.height = settings.getHeight();
        element.style.width = `${element.width}px`;
        element.style.height = `${element.height}px`;

        return context;
    }
}

import {Game} from "./js/game.js";
import {Settings} from "./js/settings.js";
import {SpriteSheet} from "./js/sprite-sheet.js";

class App {

    constructor() {
        this.level = 1;
        this.startingHp = 3;
        this.numLevels = 6;

        const settings = new Settings(12, 4, 64);
        const spriteSheet = new SpriteSheet('sprite-sheet.png', 16);
        this.game = new Game(settings, spriteSheet, this.level, this.startingHp, this.numLevels);

        this.addHtmlListener();
    }

    addHtmlListener() {
        document.querySelector('html').onkeypress = (e) => {
            if (this.game.gameState === 'title') {
                this.game.startGame();
                return;
            }

            if (this.game.gameState === 'dead') {
                this.game.showTitle();
            }

            if (this.game.gameState === 'running') {
                const needUpdate = [
                    e.key === 'w',
                    e.key === 's',
                    e.key === 'a',
                    e.key === 'd',
                ].some(Boolean);

                if (!needUpdate) { return; }

                // Update current layer (Game)
                this.game.update(e.key);
                this.game.draw();

                // New layer is a menu and others...
            }
        };
    }
}
new App();

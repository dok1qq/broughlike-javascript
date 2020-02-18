import {Game} from "./js/game.js";
import {Settings} from "./js/settings.js";

class App {
    constructor() {
        const level = 1;
        const settings = new Settings(12, 4, 64);
        this.game = new Game(settings, 'sprite-sheet.png', level);

        this.addHtmlListener();
    }

    addHtmlListener() {
        document.querySelector('html').onkeypress = (e) => {
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
        };
    }

}
new App();

import {Game} from "./js/game.js";
import {Settings} from "./js/settings.js";
// import {Util} from "./js/util.js";

class App {
    constructor(game) {

        this.game = game;



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

// const util = new Util();
const settings = new Settings(9, 4, 64);
const game = new Game(settings, 'sprite-sheet.png');
new App(game);

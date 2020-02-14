import {Game} from "./js/game.js";
import {BaseSettings} from "./js/base-settings.js";
import {Tile} from "./js/tile.js";
import {Map} from "./js/map.js";
import {Util} from "./js/util.js";

class App {
    constructor(game, settings) {
        this.game = game;
        this.settings = settings;

        this.addHtmlListener();
    }

    addHtmlListener() {
        document.querySelector('html').onkeypress = (e) => {
            if (e.key === 'w') this.settings.setY(this.settings.y - 1);
            if (e.key === 's') this.settings.setY(this.settings.y + 1);
            if (e.key === 'a') this.settings.setX(this.settings.x - 1);
            if (e.key === 'd') this.settings.setX(this.settings.x + 1);
            this.game.draw();
        };
    }

}


const settings = new BaseSettings();
const util = new Util();

const map = new Map(settings, util);
const game = new Game(settings, map);

const tile = new Tile(0, 0, 0, 0);

const app = new App(game, settings);

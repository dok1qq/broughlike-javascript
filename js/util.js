export class Util {
    constructor() {
    }

    tryTo(descr, cb) {
        for (let timeout = 1000; timeout > 0; timeout--) {
            if (cb()) {
                return;
            }
        }
        throw 'Timeout while trying to ' + descr;
    }

    randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

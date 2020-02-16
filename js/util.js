export class Util {
    static tryTo(description, cb) {
        for (let timeout = 1000; timeout > 0; timeout--) {
            const result = cb();
            if (result) {
                return result;
            }
        }
        console.log('Timeout while trying to ' + description);
        return null;
    }

    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

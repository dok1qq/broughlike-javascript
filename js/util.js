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
        return Math.round(Math.random() * (max - min) + min);
    }

    static shuffle(arr){
        let temp, r;
        for (let i = 1; i < arr.length; i++) {
            r = Util.randomRange(0, i);
            temp = arr[i];
            arr[i] = arr[r];
            arr[r] = temp;
        }
        return arr;
    }
}

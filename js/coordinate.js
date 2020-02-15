export class Coordinate {
    constructor(coords) {
        let { x, y } = coords;

        this.getX = () => x;
        this.getY = () => y;

        this.setX = (value) => { x = value; };
        this.setY = (value) => { y = value; };
    }

    update(coords) {
        this.setX(coords.x);
        this.setY(coords.y);
    }
}

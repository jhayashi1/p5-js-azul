class Player {
    constructor() {
        this.score = 0;
        this.wall = initWall();
    }

    setWall(x, y, tile) {
        this.wall[x][y] = tile;
    }

    printWall() {
        for (let i = 0; i < 5; i++) {
            console.log(this.wall[i]);
        }
    }
}

/*Make array that looks like:
    x
    x x
    x x x
    x x x x
    x x x x x
*/
function initWall() {
    let arr = new Array(5);
    for (let i = 0; i < 5; i++) {
        arr[i] = new Array(i + 1);
    }

    return arr;
}
class Player {
    constructor() {
        this.score = 0;

        //5x5 arrays for buffer rows and wall
        this.wall = [[], [], [], [], []];
        this.lines = [[], [], [], [], []];
    }

    setWall(x, y, tile) {
        this.wall[x][y] = tile;
    }

    printWall() {
        for (let i = 0; i < 5; i++) {
            console.log(this.wall[i]);
        }
    }

    setLine(row, tiles) {
        console.log(this.lines[1].length);
        this.lines[1][1] = (new Tile(colors.Black));
        console.log(this.lines[1][0]);
    }

    printLines() {
        for (let i = 0; i < 5; i++) {
            console.log(this.lines[i]);
        }
    }
}
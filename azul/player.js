class Player {
    constructor() {
        this.score = 0;

        //5x5 arrays for buffer rows and wall
        this._wall = [[], [], [], [], []];
        this._lines = [[], [], [], [], []];
        this._floorLine = [];
    }

    get wall() {
        return this._wall;
    }

    get lines() {
        return this._lines;
    }

    get floorLine() {
        return this._floorLine;
    }

    setWall(x, y, tile) {
        this.wall[x][y] = tile;
    }

    printWall() {
        for (let i = 0; i < 5; i++) {
            console.log("Player wall " + i + ": " + this.wall[i]);
            console.log(this.wall[i]);
        }
    }

    addToLine(row, tiles) {
        let i = tiles.length;
        //While there are still elements in the tiles to add
        while (i--) {
            //If the row is full, add the rest of the tiles to the floor line
            if (this.lines[row].length == row + 1) {
                this.addToFloorLine(tiles);
                break;
            }

            //Add one tile to the line
            this.lines[row].push(tiles.pop());
        }
    }

    printLines() {
        for (let i = 0; i < 5; i++) {
            console.log("Player line " + i + ": ");
            console.log(this.lines[i]);
        }
    }

    addToFloorLine(tiles) {
        let i = tiles.length

        //While there are still tiles to add
        while (i--) {
            //If the floor line is maxed out
            if (this.floorLine.length == 7) {
                //Add excess tiles to the trash
                addTilesToTrash(tiles);
                break;
            }

            //Add one tile to the floor line
            this.floorLine.push(tiles.splice(i, 1).pop());
        }
    }

    moveLinesToWall() {
        for (let i = 0; i < this.lines.length; i++) {
            //If the line is full
            if (this.lines[i].length == i + 1) {
                //offset is the column to put the tile in
                let offset = this.lines[i][i].tileColor + i;
                if (offset > WALL_DIMENSIONS - 1) {
                  offset -= WALL_DIMENSIONS;
                }
              
                //Remove one tile from the array and place it on the wall
                this.wall[offset][i] = this.lines[i].pop();
              
                //Move the rest to the trash
                for (let j = 0; j < this.lines[i].length; j++) {
                    trash.push(this.lines[i].pop());
                }
            }
        }
    }
}
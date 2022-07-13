class Board {
    constructor() {
        this.bag = []
        this.factories = new Array(NUM_FACTORIES);
        this.trash = [];
        this.players = new Population(4);
        this.playerTurn = 0;

        //Initialize the bag with 20 of each tile and shuffle it
        for (let i = 0; i < 20; i++) {
            this.bag.push(new Tile(colors.Red), new Tile(colors.Blue), new Tile(colors.Yellow), new Tile(colors.Black), new Tile(colors.White));
        }
        this.bag = shuffleArray(this.bag);
    }

    startRound() {
        //If the bag runs out of tiles, move the tiles from the trash into the bag and shuffle it
        if (this.bag.length < 4) {
          transferAllTiles(this.bag, this.trash);
          shuffleArray(this.bag);
        }
      
        //Add 4 tiles to each factory
        for (let i = 0; i < NUM_FACTORIES; i++) {
            this.factories[i] = this.bag.splice(0, 4);
        }
    }

    nextMove() {
        this.players.population[this.playerTurn].look();
        this.players.population[this.playerTurn].think();
        this.players.population[this.playerTurn].move();

        this.playerTurn++;

        if (this.playerTurn > 3) {
            this.playerTurn = 0;
        }
    }

    endRound() {
        let gameEnd = false;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].moveLinesToWall()) {
                gameEnd = true;
            }
        }

        if (gameEnd) {
            this.endGame();
        } else {
            this.startRound();
        }
    }

    endGame() {

    }

    getTensorState() {
        let ret = [];

        //Get the tiles in the factories
        for (let i = 0; i < NUM_FACTORIES; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.factories[i][j]) {
                    ret.push(this.factories[i][j].tileColor / 5.0);
                } else {
                    ret.push(0);
                }
            }
        }

        //Get all player's info
        for (let i = 0; i < this.players.population.length; i++) {
            let player = this.players.population[i];
            let w = [];
            let l = [];
            let f = [];

            for (let j = 0; j < WALL_DIMENSIONS; j++) {
                for (let k = 0; k < WALL_DIMENSIONS; k++) {
                    if (player.wall[j][k]) {
                        w.push(player.wall[j][k].tileColor / 5.0);
                    } else {
                        w.push(0);
                    }

                    if (k > j) {
                        continue;
                    }

                    if (player.lines[j][k]) {
                        l.push(player.lines[j][k].tileColor / 5.0);
                    } else {
                        l.push(0);
                    }
                }
            }

            for (let j = 0; j < 7; j++) {
                if (player.floorLine[j]) {
                    f.push(player.floorLine[j].tileColor / 5.0);
                } else {
                    f.push(0);
                }
            }

            //Add player wall, lines, floorline info
            ret = ret.concat(w);
            ret = ret.concat(l);
            ret = ret.concat(f);
            ret.push(player.score);
        }

        // let med = medianOf2Arr(ret);
        // let stdev = getStandardDeviation(ret);
        // for (let i = 0; i < ret.length; i++) {
        //     ret[i] = (ret[i] - med) / stdev;
        // }

        return ret;
    }
}
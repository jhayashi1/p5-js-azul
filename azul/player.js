class Player {
    constructor(id) {
        this.score = 0;

        //5x5 arrays for buffer rows and wall
        this.wall = [[], [], [], [], []];
        this.lines = [[], [], [], [], []];
        this.floorLine = [];
        this.score = 0;

        //NEAT Stuff
        this.brain = new Genome(genomeInputsN, genomeOutputN, id);
        this.fitness;
        this.lifespan = 0;
        this.decisions = [];
        this.vision = [];
    }

    setWall(x, y, tile) {
        this.wall[x][y] = tile;
    }

    printWall() {
        for (let i = 0; i < WALL_DIMENSIONS; i++) {
            console.log("Player wall " + i + ": " + this.wall[i]);
            console.log(this.wall[i]);
        }
    }

    addToLine(row, tiles) {
        let i = tiles.length;
        //While there are still elements in the tiles to add
        while (i--) {
            //If the row is full, add the rest of the tiles to the floor line
            if (this.lines[row].length === row + 1) {
                this.addToFloorLine(tiles);
                break;
            }

            //Add one tile to the line
            this.lines[row].push(tiles.pop());
        }
    }

    printLines() {
        for (let i = 0; i < WALL_DIMENSIONS; i++) {
            console.log("Player line " + i + ": ");
            console.log(this.lines[i]);
        }
    }

    addToFloorLine(tiles) {
        let i = tiles.length

        //While there are still tiles to add
        while (i--) {
            //If the floor line is maxed out
            if (this.floorLine.length === 7) {
                //Add excess tiles to the trash
                transferAllTiles(board.trash, tiles);
                break;
            }

            //Add one tile to the floor line
            this.floorLine.push(tiles.splice(i, 1).pop());
        }
    }

    moveLinesToWall() {
        let gameEnd = false;
        for (let i = 0; i < this.lines.length; i++) {
            //If the line is full
            if (this.lines[i].length === i + 1) {
                //offset is the column to put the tile in
                let offset = this.lines[i][i].tileColor + i - 1;
                if (offset > WALL_DIMENSIONS - 1) {
                  offset -= WALL_DIMENSIONS;
                }
              
                //Remove one tile from the array and place it on the wall
                this.wall[offset][i] = this.lines[i].pop();
              
                if (this.lines[i].length) {
                    //Move the rest to the trash
                    transferAllTiles(board.trash, this.lines[i]);
                }

                //If a horizontal line is filled, end the game after calculating the scores
                if (this.calculateScore(offset, i)) {
                    gameEnd = true
                }
            }
        }

        return gameEnd;
    }

    calculateScore(x, y) {
        let scoreToAdd = 0;
        let hasPassed = false;
        let gameEnd = false;
        for (let i = 0; i < WALL_DIMENSIONS; i++) {
            //If it is on the new tile, set hasPassed to true
            if (i === y) {
                hasPassed = true;
            }

            //If there is a tile in the position, add 1 to the score
            if (this.wall[x][i]) {
                scoreToAdd++;
            } else {
                if (hasPassed) {
                    this.score += scoreToAdd;
                    scoreToAdd = 0;
                    break;
                }

                scoreToAdd = 0;
            }

            if (hasPassed && i === WALL_DIMENSIONS - 1) {
                this.score += scoreToAdd;
                scoreToAdd = 0;
            }
        }

        for (let i = 0; i < WALL_DIMENSIONS; i++) {
            //If it is on the new tile, set hasPassed to true
            if (i === x) {
                hasPassed = true;
            }

            //If there is a tile in the position, add 1 to the score
            if (this.wall[i][y]) {
                scoreToAdd++;
            } else {
                if (hasPassed) {
                    this.score += scoreToAdd;
                    break;
                }
                scoreToAdd = 0;
            }

            //If the entire row is filled, end the game
            if (hasPassed && i === WALL_DIMENSIONS - 1) {
                this.score += scoreToAdd;
                scoreToAdd = 0;
                gameEnd = true;
                break;
            }
        }

        this.removeFromFloorLines();

        return gameEnd;
    }

    removeFromFloorLines() {
        //If the player has tiles in their floorline
        if (this.floorLine.length) {
            //Calculate the penalty based on the number of tiles in the floorline
            let penalty = () => {
                switch (this.floorLine.length) {
                    case 1:
                    return -1;
                    case 2:
                    return -2;
                    case 3:
                    return -4;
                    case 4:
                    return -6;
                    case 5:
                    return -8;
                    case 6:
                    return -11;  
                    case 7:
                    return -14;
                }
            }
    
            //Subtract the penalty and make sure the score isn't negative
            this.score += penalty();
            if (this.score < 0) {
                this.score = 0;
            }
            console.log("Subtracted from floorline - new score: " + this.score);
    
            transferAllTiles(board.trash, this.floorLine.splice(0, this.floorLine.length));
        }
    }

    //NEAT STUFF
    ////////////////////////////////////////////////////
    clone() { //Returns a copy of this player
		let clone = new Player();
		clone.brain = this.brain.clone();
		return clone;
	}

	crossover(parent){ //Produce a child
		let child = new Player();
		if(parent.fitness < this.fitness)
			child.brain = this.brain.crossover(parent.brain);
		else
			child.brain = parent.brain.crossover(this.brain);

		child.brain.mutate()
		return child;
	}


	//Game stuff
	look(show){
		this.vision = board.getTensorState();
	}

	think(){
		this.decisions = this.brain.feedForward(this.vision);
	}

	move(){
        let colorToPick = Math.floor(this.decisions[0]) % 5 + 1;
        let factoryToPick = Math.floor(this.decisions[1]) % NUM_FACTORIES;
        let lineToPick = Math.floor(this.decisions[2]) % 5;
        let check = false;

        let initialFactory = factoryToPick;
        //Check to make sure that the color exists in the factory
        while (true) {
            //If the color exists in the factory, set check to true
            for (let i = 0; i < board.factories[factoryToPick].length; i++) {
                if (board.factories[factoryToPick][i].tileColor === colorToPick) {
                    check = true;
                    break;
                }
            }

            //Break if the color is in the factory
            if (check) {
                break;
            }

            //Increment factory by 1 if the color is not in the factory
            factoryToPick++;

            //Make sure that the factory number exists
            if (factoryToPick > NUM_FACTORIES - 1) {
                factoryToPick = 0;
            }

            //If the color is not in any factory, increment color
            if (factoryToPick === initialFactory) {
                colorToPick++;

                //Make sure that the color exists
                if (colorToPick > 5) {
                    colorToPick = 1;
                }
            }
        }

        let initialLine = lineToPick;
        while (true) {
            if ((!this.lines[0][lineToPick] && !this.wall[colorToPick + lineToPick - 1][lineToPick]) 
                || this.lines[0][lineToPick].tileColor === colorToPick) {
                        break;
            }

            lineToPick++;

            if (initialLine === lineToPick) {
                
            }
        }

        //Take from the factory
        takeFromFactory(this, colorToPick, board.factories[factoryToPick], lineToPick);
	}

	update(){
	}

	show(){
	}

	calculateFitness(){ //Fitness function : adapt it to the needs of the
		this.hitRate = this.score/this.ship.shots;
		this.fitness = (this.score)*10;
		this.fitness *= this.lifespan;
		this.fitness *= this.hitRate*this.hitRate;	
		this.fitness *= expFunc ? this.fitness : 1;
	}
}
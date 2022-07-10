//RULES https://tesera.ru/images/items/1108676/EN-Azul-Rules.pdf
//TODO: scorekeeping at the end of the round
let a = 80;
const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 1200;
const WALL_DIMENSIONS = 5;
const NUM_FACTORIES = 9;
const CIRCLE_BACKGROUND = '#FBBF77';
const BOARD_BACKGROUND = '#EEE8AA'
const colors = {
  Blue: 0,
  Yellow: 1,
  Red: 2,
  Black: 3,
  White: 4,
  First: 5
}
let bag = [];
let factories = [];
let trash = [];

// let config = {
// 	model: [
// 		{nodeCount: 9, type: "input"},
// 		{nodeCount: 9, type: "output", activationfunc: activation.SOFTMAX}
// 	],
// 	mutationRate: 0.1,
// 	crossoverMethod: crossover.RANDOM,
// 	mutationMethod: mutate.RANDOM,
// 	populationSize: TOTAL
// };

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  background(80);
  noLoop();
  setupGame();

  trash.push(new Tile(colors.Yellow), new Tile(colors.Yellow), new Tile(colors.Blue), new Tile(colors.Red), new Tile(colors.Black), new Tile(colors.White))
  shuffleArray(trash);
}

function draw() {
  renderFactories();
  renderPlayerBoards();
}

//Setup arrays and objects
function setupGame() {
    //Initialize the bag with 20 of each tile and shuffle it
    for (let i = 0; i < 20; i++) {
      bag.push(new Tile(colors.Red), new Tile(colors.Blue), new Tile(colors.Yellow), new Tile(colors.Black), new Tile(colors.White));
    }
    bag = shuffleArray(bag);
  
    factories = new Array(NUM_FACTORIES);

    p = new Player();
    startRound();
    takeFromFactory(p, colors.Red, factories[0], 0);
    p.moveLinesToWall();

    //Update the board state
   // redraw();
}

function startRound() {
  //If the bag runs out of tiles, move the tiles from the trash into the bag and shuffle it
  if (bag.length < 4) {
    for (var t of trash) {
      bag.push(t);
    }

    shuffleArray(bag);
  }

  //Add 4 tiles to each factory
  for (let i = 0; i < NUM_FACTORIES; i++) {
    factories[i] = bag.splice(0, 4);
  }
}

function takeFromFactory(player, tileColor, factory, row) {
  let i = factory.length;
  let toAdd = [];

  //Loop through factory backwards and add any tiles that match the color being taken
  while (i--) {
    //If the color matches, get the single element
    if (factory[i].tileColor == tileColor) {
      toAdd.push(factory.splice(i, 1).pop());
    }
  }
  
  //Add the tiles to the player's line
  player.addToLine(row, toAdd);
}

function renderFactories() {
  let centerX = SCREEN_WIDTH/2;               //X position of the center of the trash and the rest of the circles
  let centerY = SCREEN_HEIGHT/2;              //Y position of the center of the trash and the rest of the circles
  let centerDiameter = 200;                   //Diameter of the center circle
  let circleDiameter = centerDiameter * 0.5;  //Diameter of the factory circles
  let circleDist = centerDiameter * 0.85;     //Distance from the center for the factory circles
  let squareLen = circleDiameter * 0.25;      //Length of the lines of the squares

  fill(CIRCLE_BACKGROUND);

  //Draw the center circle
  circle(centerX, centerY, centerDiameter);

  //Draw tiles in trash
  for (i = 0; i < trash.length; i++) {
    console.log(trash);
    let squareColor = getColorString(trash[i].tileColor);
    fill(squareColor);

    let x = centerX + squareLen*2 * Math.cos((2*i*Math.PI)/trash.length);
    let y = centerY + squareLen*2 * Math.sin((2*i*Math.PI)/trash.length);

    square(x - squareLen/2, y - squareLen/2, squareLen);
  }

  fill(CIRCLE_BACKGROUND);

  //Draw a circle for each factory
  for (i = 0; i < NUM_FACTORIES; i++) {
    //Get the x and y position for the circle
    let x = centerX + circleDist * Math.cos((2*i*Math.PI)/NUM_FACTORIES);
    let y = centerY + circleDist * Math.sin((2*i*Math.PI)/NUM_FACTORIES);

    //Draw the circle representing the factory
    circle(x, y, circleDiameter);

    //Draw a square for each tile in the factory
    for (j = 0; j < factories[i].length; j++) {
      //Get the color of the tile as a string and set the color pf the square
      let squareColor = getColorString(factories[i][j].tileColor);
      fill(squareColor);

      //Get the x and y position for the square
      let squareX = x + squareLen * 1.2 * Math.cos((2 * j * PI) / factories[i].length);
      let squareY = y + squareLen * 1.2 * Math.sin((2 * j * PI) / factories[i].length);

      //Draw the square representing the tile
      square(squareX - squareLen / 2, squareY - squareLen / 2, squareLen);
    }

    //Change the fill color back to white
    fill(CIRCLE_BACKGROUND);
  }
}

function renderPlayerBoards() {
  let squareLen = 60;
  let offset = 50;
  let boardX = SCREEN_WIDTH / 32;
  let boardY = SCREEN_HEIGHT / 32;
  let boardWidth = squareLen * 10 + offset;
  let boardHeight = squareLen * 10 / 2 + 100;

  //Draws the board
  fill(BOARD_BACKGROUND);
  rect(boardX, boardY, boardWidth, boardHeight);

  //Draws the tile spaces
  for (let i = 0; i < p.wall.length; i++) {
    for (let j = 0; j < p.wall.length; j++) {
      let squareX = boardX + ((boardWidth - offset) / 2 + offset) + i * squareLen; 
      let squareY = boardY + j * squareLen;

      if (p.wall[i][j]) {
        fill(getColorString(p.wall[i][j].tileColor));
      } else {
        fill('lightgrey');
      }

      //Draws the wall
      square(squareX, squareY, squareLen);

      //Draws the lines
      if (i + j < 4) {
        continue;
      }

      squareX = boardX + i * squareLen; 

      if (p.lines[i][j]) {
        fill(getColorString(p.wall[i][j].tileColor));
      } else {
        fill('lightgrey');
      }

      square(squareX, squareY, squareLen);
    }
  }

  for (let i = 0; i < 7; i++) {
    let squareX = boardX + i * squareLen;
    let squareY = boardY + boardHeight - squareLen;

    //Draw the floorline squares
    if (p.floorLine[i]) {
      fill(getColorString(p.floorLine[i].tileColor));
    } else {
      fill('lightgrey')
    }
    
    square(squareX, squareY, squareLen);

    //Draw the half circles above the floorline
    //NOTE: arc starting coordinates are at the center
    let arcX = squareX + squareLen / 2;
    fill('lightblue');

    arc(arcX, squareY, squareLen, squareLen, PI, TWO_PI);

    //Fill the half circles with text
    textSize(16);
    textAlign(CENTER);
    fill('black');
    let t = () => {
      switch (i) {
        case 0:
        case 1:
          return '-1';
        case 2:
        case 3:
        case 4:
          return '-2';
        case 5:
        case 6:
          return '-3';
      }
    }
    text(t(), arcX, squareY - squareLen / 8);
  }
}

function shuffleArray(arr) {
  let curIndex = arr.length;

  //While elements still need to be shuffled
  while (curIndex != 0) {
    //Pick remaining element and random element
    randomIndex = Math.floor(Math.random() * curIndex);
    curIndex--;

    //Swap the two elements
    [arr[curIndex], arr[randomIndex]] = [arr[randomIndex], arr[curIndex]];
  }

  return arr;
}

function addTilesToTrash(tiles) {
  //Add all tiles in the array to the trash
  for (var i of tiles) {
    trash.push(tiles.pop());
  }
}

function getColorString(c) {
  switch (c) {
    case colors.Blue:
      return 'blue';
    case colors.Yellow:
      return 'yellow';
    case colors.Red:
      return 'red';
    case colors.Black:
      return 'black';
    case colors.White:
      return 'white';      
  }
}

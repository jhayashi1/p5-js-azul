//RULES https://tesera.ru/images/items/1108676/EN-Azul-Rules.pdf
//TODO: scorekeeping at the end of the round
let a = 80;
const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 1200;
const WALL_DIMENSIONS = 5;
const NUM_FACTORIES = 9;
const CIRCLE_BACKGROUND = '#FBBF77';
const BOARD_BACKGROUND = '#EEE8AA'
var board;

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  background(80);
  noLoop();
  textSize(12);
  textAlign(CENTER);

  board = new Board();
  board.startRound();

  // button = createButton("Next move");
  // button.position(SCREEN_WIDTH / 2, 100);
  // button.mouseClicked(board.nextMove);

  console.log("fully loaded");
}

function draw() {
  board.nextMove();
  renderFactories();
  renderPlayerBoards();
}

function mousePressed() {
  redraw();
}

function takeFromFactory(player, tileColor, factory, row) {
  let i = factory.length;
  let toAdd = [];

  //Loop through factory backwards and add any tiles that match the color being taken
  while (i--) {
    //If the color matches, get the single element
    if (factory[i].tileColor === tileColor) {
      toAdd.push(factory.splice(i, 1).pop());
      continue;
    }
  }
  
  //If there are tiles to add to the line
  if (toAdd.length) {
    //Add the tiles to the player's line
    player.addToLine(row, toAdd);

    //Move the rest of the tiles to the trash
    transferAllTiles(board.trash, factory);
  }
}

//Formula for a circle: (center_x + distance * cos(2i * pi / n), center_y + distance * sin(2i * pi / n))
//where i is the loop iteration and n number of elements
function renderFactories() {
  let centerX = SCREEN_WIDTH / 2;             //X position of the center of the board and the rest of the circles
  let centerY = SCREEN_HEIGHT / 2;            //Y position of the center of the board and the rest of the circles
  let centerDiameter = 200;                   //Diameter of the center circle
  let circleDiameter = centerDiameter * 0.5;  //Diameter of the factory circles
  let circleDist = centerDiameter * 0.85;     //Distance from the center for the factory circles
  let squareLen = circleDiameter * 0.25;      //Length of the lines of the squares

  fill(CIRCLE_BACKGROUND);

  //Draw a circle for each factory
  for (i = 0; i < NUM_FACTORIES; i++) {
    //Get the x and y position for the circle
    let x = centerX + circleDist * Math.cos((2 * i * PI) / NUM_FACTORIES);
    let y = centerY + circleDist * Math.sin((2 * i * PI) / NUM_FACTORIES);

    //Draw the circle representing the factory
    circle(x, y, circleDiameter);

    //Draw a square for each tile in the factory
    for (j = 0; j < board.factories[i].length; j++) {
      //Get the color of the tile as a string and set the color pf the square
      let squareColor = getColorString(board.factories[i][j].tileColor);
      fill(squareColor);

      //Get the x and y position for the square
      let squareX = x + squareLen * 1.2 * Math.cos((2 * j * PI) / board.factories[i].length);
      let squareY = y + squareLen * 1.2 * Math.sin((2 * j * PI) / board.factories[i].length);

      //Center the square 
      squareX = squareX - squareLen / 2;
      squareY = squareY - squareLen / 2;

      //Draw the square representing the tile
      square(squareX, squareY, squareLen);
      placeText(i, j, squareX, squareY, squareLen);
    }

    //Change the fill color back to white
    fill(CIRCLE_BACKGROUND);
  }
}

function renderPlayerBoards() {
  let squareLen = 50;
  let offset = 50;
  let boardWidth = squareLen * 10 + offset;
  let boardHeight = squareLen * 10 / 2 + 100;

  for (let i = 0; i < board.players.population.length; i++) {
    let p = board.players.population[i];
    let boardX = SCREEN_WIDTH / 32;
    let boardY = SCREEN_HEIGHT / 32;

    //If player 3 or 4, move their board to the bottom side of the screen
    if (i > 1) {
      boardY = SCREEN_HEIGHT - boardY - boardHeight;
    }

    //If player 2 or 4, move their board to the right side of the screen
    if (i % 2 === 1) {
      boardX = SCREEN_WIDTH - boardX - boardWidth;
    }

    //Draws the board
    fill(BOARD_BACKGROUND);
    rect(boardX, boardY, boardWidth, boardHeight);

    //Draws the tile spaces
    for (let i = 0; i < p.wall.length; i++) {
      for (let j = 0; j < p.wall.length; j++) {
        //Get the x and y position of the square
        let squareX = boardX + ((boardWidth - offset) / 2 + offset) + i * squareLen; 
        let squareY = boardY + j * squareLen;

        //Set the color based on the tile color, otherwise make it light grey
        if (p.wall[i][j]) {
          fill(getColorString(p.wall[i][j].tileColor));
        } else {
          fill('lightgrey');
        }

        //Draws the wall
        square(squareX, squareY, squareLen);
        placeText(i, j, squareX, squareY, squareLen);

        //Draws the lines
        if (j > i) {
          continue;
        }

        //Get the x position of the square. The y position is the same as the other square
        squareX = boardX + (p.wall.length - j) * squareLen - offset; 
        squareY = boardY + i * squareLen;

        //Set the color based on the tile color, otherwise make it light grey
        if (p.lines[i][j]) {
          fill(getColorString(p.lines[i][j].tileColor));
        } else {
          fill('lightgrey');
        }

        //Draw the square
        square(squareX, squareY, squareLen);
        placeText(i, j, squareX, squareY, squareLen);
      }
    }

    for (let i = 0; i < 7; i++) {
      //Get the x and y position of the square
      let squareX = boardX + i * squareLen;
      let squareY = boardY + boardHeight - squareLen;

      //Set the color based on the tile color, otherwise make it light grey
      if (p.floorLine[i]) {
        fill(getColorString(p.floorLine[i].tileColor));
      } else {
        fill('lightgrey')
      }
      
      //Draw the square
      square(squareX, squareY, squareLen);

      //Draw the half circles above the floorline
      //NOTE: arc starting coordinates are at the center
      let arcX = squareX + squareLen / 2;
      fill('lightblue');

      //Draw the half circle
      arc(arcX, squareY, squareLen, squareLen, PI, TWO_PI);

      //Fill the half circles with text
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

      //Draw the text
      text(t(), arcX, squareY - squareLen / 8);
    }
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

function transferAllTiles(toArr, tiles) {
  let len = tiles.length;
  //Add all tiles in the array to the trash
  for (let i = 0; i < len; i++) {
    toArr.push(tiles.pop());
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

function placeText(i, j, x, y, squareLen) {
  fill('green');
  text(i + ", " + j, x + squareLen / 2, y + squareLen / 2);
}
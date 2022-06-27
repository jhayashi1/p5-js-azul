//RULES https://tesera.ru/images/items/1108676/EN-Azul-Rules.pdf
//TODO: functionality for moving from lines to wall
//TODO: scorekeeping at the end of the round
let a = 80;
const NUM_FACTORIES = 5;
const colors = {
  Red: "Red",
  Blue: "Blue",
  Yellow: "Yellow",
  Black: "Black",
  White: "White",
  First: "First"
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
  createCanvas(800, 800);
  background(80);
  stroke(255);
  noLoop();
  setupGame();
}

function draw() {

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
    p.printWall();
    startRound();
    takeFromFactory(p, colors.Red, factories[0], 4);
}

function startRound() {
  for (let i = 0; i < NUM_FACTORIES; i++) {
    factories[i] = bag.splice(0, 4);
    console.log("Factory " + i + ": ");
    console.log(factories[i]);
  }
}

function takeFromFactory(player, color, factory, row) {
  let i = factory.length;
  let toAdd = [];

  //Loop through factory backwards and splice any tiles that match the color
  while (i--) {
    //If the color matches, splice it
    if (factory[i].getColor() == color) {
      toAdd.push(factory.splice(i, 1));
    }
  }
  
  //Add the tiles to the player's line
  player.addToLine(row, toAdd);
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
  trash.push(tiles.splice(0, tiles.length));
}

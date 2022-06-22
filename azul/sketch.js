let a = 80;
const colors = {
  Red: "Red",
  Blue: "Blue",
  Yellow: "Yellow",
  Black: "Black",
  White: "White",
  First: "First"
}
let bag = [];
let 

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
  
    p = new Player();
    p.printWall();
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

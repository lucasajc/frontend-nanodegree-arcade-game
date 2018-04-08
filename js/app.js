
//set of constants used on the game
const playerStepY = 83;
const playerStepX = 101;

const minX = 0;
const minY = 0;
const maxX = 400;
const maxY = 317;

//number of layers of the course and their levels
const layers = [317,234,151,68];

const bugHeight = 80;
const bugWidth = 80;

const playerHeight = 80;
const playerWidth = 80;

const startPosition = [200,400];

const audioShut = new Audio('./sounds/shutdown.wav');
const audioWin = new Audio('./sounds/win.wav');

let win = false;
/**
  * Superclass that includes the general parameters and methods of entities "player" and "enemy"
*/
class Entity{
  constructor(width, height, x, y, sprite) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  }
  // Draw the entity on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player extends Entity{
  constructor(width, height, x, y, sprite, moves = 0) {
    super(width, height, x, y, sprite);
    this.moves = this.moves;
  }

  /**
    *  Code executed at each moment of time by the player object
  */
  update(dt) {
    checkVictory();
  }

  /**
    *  Handle the input of player data to the game
  */
  handleInput(key) {
    if(!win){
      switch(key){
        case 'left':{
          if(this.x >= minX){
            this.x-=playerStepX;
          }
          break;
        }
        case 'up':{
          if(this.y >= minY){
            this.y-=playerStepY;
          }
          break;
        }
        case 'right':{
          if(this.x <= maxX){
            this.x+=playerStepX;
          }
          break;
        }
        case 'down':{
          if(this.y <=maxY){
            this.y+=playerStepY;
          }
          break;
        }
      }
    }
  }
}

// Enemies our player must avoid
class Enemy extends Entity{
  constructor(width, height, x, y, sprite, speed, direction) {
    super(width, height, x, y, sprite);
    this.speed = speed;
    this.direction = direction;
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {

    if(win){
      this.speed = 1000;
    }
    //handle the direction of the bugs (right or left)
    if(this.direction){
      this.x+=(this.speed*dt);
      if(this.x >= (maxX+playerStepX)){
        this.x=-playerStepX;
        this.speed = Math.floor((Math.random() * 250) + 100);
      }
    }
    else{
      this.x-=(this.speed*dt);
      if(this.x <= (minX-playerStepX)){
        this.x= maxX+playerStepX;
        this.speed = Math.floor((Math.random() * 250) + 100);
      }
    }
  }
}

/**
  * Checks whether two 2D rectangles are colliding.
  * This function can check if the X axis of the two objects is colliding and then if the axis Y is colliding.
*/
function rectangleOverlap(r1,r2) {
 return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.height + r1.y > r2.y;
}

/**
  * Checks if all 2D rectangles of the game are colliding.
*/
function checkCollisions(){
  for(i=0;i<allEnemies.length;i++){
    if(rectangleOverlap(allEnemies[i],player)){
      audioShut.play();
      restartGame();
      allEnemies[i].speed = 500;
    }
  }
}

/**
  * Set of actions that should happen when the game is restarted.
*/
function restartGame(){
  win = false;
  player.x = startPosition[0];
  player.y = startPosition[1];
}

/**
  * Check if the player has reached the end of the course
*/
function checkVictory(){
  if(player.y < layers[3]){
    audioWin.play();
    win = true;
    setTimeout(function() {
      for(i;i<allEnemies.length;i++){
        allEnemies[i].speed = 200;
      }

      restartGame();
    },1000);
  }
  else{
    win = false;
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let enemy1 = new Enemy(bugWidth,bugHeight,-playerStepX,layers[0],'images/enemy-bug.png',200,true);
let enemy2 = new Enemy(bugWidth,bugHeight,-playerStepX,layers[1],'images/enemy-bug-reverse.png',100,false);
let enemy3 = new Enemy(bugWidth,bugHeight,-playerStepX,layers[2],'images/enemy-bug.png',250,true);
let enemy4 = new Enemy(bugWidth,bugHeight,-playerStepX,layers[3],'images/enemy-bug-reverse.png',300,false);
let allEnemies = [enemy1,enemy2,enemy3,enemy4];

let player = new Player(playerWidth,playerHeight,startPosition[0],startPosition[1],'images/char-horn-girl.png');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

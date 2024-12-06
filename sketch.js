//Use the arrow keys to move your player and collect all 8 coins

/* VARIABLES */
let player, ground, monster, platforms, coins;
let score = 0;

/* PRELOAD LOADS FILES */
function preload() {
  monsterImg = loadImage('assets/monster.png');
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(400, 400);
  world.gravity.y = 10;

  //Resize image
  monsterImg.resize(40, 0);

  //Create player
  player = new Sprite(50, 250, 40, 40);
  player.color = 'grey';
  player.rotationLock = true;
  player.vel.x = 0;
  player.vel.y = 0;

  //Create ground
  ground = new Sprite(150, 380, 600, 40, "s");
  ground.color = color(188, 158, 130);
  ground.friction = 0;

  //Create monster
  monster = new Sprite(monsterImg, 750, 199, "k");
  monster.friction = 0;

  //Create platforms group
  platforms = new Group();
  platforms.color = "rgb(90,255,0)";
  platforms.collider = "s";
  platforms.friction = 0;

  platforms2 = new Group();
  platforms2.color = "red";
  platforms2.collider = "s";
  platforms2.friction = 3
  
  //Create coins group
  coins = new Group();
  coins.color = "yellow";
  coins.collider = "k";

  //Overlaps method takes in a Sprite or group name (coins), then calls a function (collect)
  player.overlaps(coins, collect);

  //Load starting screen
  loadStartScreen();
}

/* DRAW LOOP REPEATS */
function draw() {
  background(7, 8, 8);
  
  //Draw instructions and score to screen
  fill(390);
  textAlign(LEFT);
  textSize(20);
  text('Coins = ' + score, 10, 60);
  textSize(15);
  text('Collect all 100 coins to win!', 10, 30);

  //Move the player
  if (kb.presses("up")) {
    player.vel.y = -6;
  }

  if (kb.pressing("left")) {
    player.vel.x = -3;
  } else if (kb.pressing("right")) {
    player.vel.x = 3;
  } else {
    player.vel.x = 0;
  }

  //Stop player from moving outside of screen
  if (player.x < 20) {
    player.x = 20;
  }
  
  if (player.x > 5000) {
    player.x = 5000;
  }
  
  if (player.y < 20){
    player.y = 20;
  }

  //Move monster
  if (monster.y < 200) {
    monster.vel.y = 3;
  } else if (monster.y > 360) {
    monster.vel.y = -3;
  }

  //Collide with monster and restart
  if (player.collides(monster)) {
    reset();
  }

  //Collect 100 coins and win
  if (score == 100) {
    youWin();
  }

  //Set camera to follow player
  camera.x = player.x + 101;
  ground.x = camera.x; 
}

/* FUNCTIONS */
function loadStartScreen() {
  platforms.removeAll();
  coins.removeAll();

  //Move player to starting position
  player.x = 50;

  //Create two platforms
  new platforms.Sprite(110, 310, 50, 100);
  new platforms.Sprite(260, 200, 150, 30);
 
  new platforms2.Sprite(400, 300, 1150, 30)

  //Create eight coins
  new coins.Sprite(220, 170, 15);
  new coins.Sprite(260, 170, 15);
  new coins.Sprite(300, 170, 15);
  new coins.Sprite(600, 350, 15);
  new coins.Sprite(640, 350, 15);
  new coins.Sprite(680, 350, 15);
  new coins.Sprite(810, 350, 15);
  new coins.Sprite(850, 350, 15);
  
}

function reset() {
  score = 0;
  loadStartScreen();
}

//This function uses parameters 
function collect(player, coin) {
  coin.remove();
  score = score + 1;
}

function youWin() {
  //Draw sprites off screen
  monster.x = 2000;
  player.x = 3000;

  //Draw end of game text
  textSize(20);
  fill(0);
  text("You win!", width/2 - 50, height/2 - 30); 
  textSize(12);
  text("Press Run to play again.", width/2 - 75, height/2);
}

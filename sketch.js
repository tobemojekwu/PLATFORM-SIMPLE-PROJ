/* VARIABLES */
let player, monster3, platforms, coins, platforms2;
let score = 0; // this is to Track the score of the game
let selectedSpriteIndex = null; // Index for the selected player sprite
let isGameStarted = false; // Controls whether the game has started

let bgMusic, coinSound; // Audio files for background music and coin collection sound
let button; // The "Run" button

/* PRELOAD LOADS FILES */
function preload() {

  // Load image assets for game sprites and background
  monster3Img = loadImage('assets/monster3.png'); // Monster image

  // Load audio files
  bgMusic = loadSound('audio/audio1.mp3'); // Background music
  coinSound = loadSound('audio/coinSound.mp3'); // Coin sound
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(800, 700); // Create the game canvas with dimensions
  world.gravity.y = 10; // Set gravity for the game world

  // Create the "Run" button and place it beneath the canvas
  button = createButton('Run');
  button.position(50, 350); // i'm Placing it beneath the canvas
  button.mousePressed(startGame); // to Call startGame when the button is pressed

  // Initially hide the button
  button.hide();

  // Resize images for proper sprite scaling
  monster3Img.resize(40, 0);

  // Optionally play background music
  bgMusic.loop(); // Uncomment to play background music in a loop
}

/* DRAW LOOP REPEATS */
function draw() {
  if (!isGameStarted) {
    displayHomeScreen(); // Show the home screen if the game hasn't started
  } else {
    playGame(); // Main game loop, runs once the game has started
  }
}

/* HOME SCREEN FUNCTION */
function displayHomeScreen() {
  background(6); // Set background color for the home screen
  textSize(20);
  fill(255);
  textAlign(CENTER);
  text("Choose Your Player", width / 2, 50); // Display text to choose player

  // Create circles representing player options
  for (let i = 0; i < 8; i++) {
    fill(100 + i * 50, 500, 50, 400); // the Color for each sprite option
    circle(80 + i * 70, 200, 50); // Draw circles for sprite selection

    // If a player clicks on a circle, select that sprite
    if (mouseIsPressed && mouseX > 80 + i * 80 && mouseX < 130 + i * 80 && mouseY > 200 && mouseY < 250) {
      selectedSpriteIndex = i; //i  Set the selected sprite index
      startGame(); // to Start the game after selecting a sprite
    }
  }
}

/* START GAME FUNCTION */
function startGame() {
  isGameStarted = true; // Set game status to started

  // Create player sprite with a color matching the selected sprite index
  player = new Sprite(50, 250, 40);
  player.color = color(100 + selectedSpriteIndex * 50, 500, 10); // Color corresponds to the selected sprite
  player.rotationLock = true; // Lock rotation to avoid player rotation
  player.vel.x = 0;
  player.vel.y = 0;

  // Create the monster3 enemy sprite
  monster3 = new Sprite(monster3Img, 750, 199, "k");
  monster3.friction = 0; // No friction for the monster3

  // Create platforms group for the player to jump on
  platforms = new Group();
  platforms.color = "rgb(90,255,0)"; // Color for the platforms
  platforms.collider = "s"; // Set platform collider type
  platforms.friction = 0; // No friction for the platforms

  // Create more difficult platforms
  platforms2 = new Group();
  platforms2.color = "red"; // Color for the second set of platforms
  platforms2.collider = "s"; // Set platform collider type
  platforms2.friction = 3; // Higher friction for these platforms

  // Create coins group to collect
  coins = new Group();
  coins.color = "yellow"; // Coin color
  coins.collider = "k"; // Set coin collider type

  // Set up the overlap function to collect coins when the player touches them
  player.overlaps(coins, collect);

  // Load the starting screen elements like platforms and coins
  loadStartScreen();
}

/* MAIN GAME FUNCTION */
function playGame() {
  background(24, 237, 237); // Set background color for the game

  // Display score and instructions on the screen
  fill(255);
  textAlign(LEFT);
  textSize(20);
  text("Coins = " + score, 10, 60);
  textSize(15);
  text("Collect all coins to win!", 10, 30);

  // Handle player movement based on keyboard inputs
  if (kb.presses("up")) {
    player.vel.y = -6; // Jump up
  }

  if (kb.pressing("left")) {
    player.vel.x = -3; // Move left
  } else if (kb.pressing("right")) {
    player.vel.x = 3; // Move right
  } else {
    player.vel.x = 0; // Stop moving horizontally if no key is pressed
  }

  // Prevent the player from moving out of the screen boundaries
  if (player.x < 10) player.x = 10;
  if (player.x > 1000) player.x = 1000;
  if (player.y < 10) player.y = 10;

  // Monster movement: oscillate vertically between two positions
  if (monster3.y < 200) {
    monster3.vel.y = 3;
  } else if (monster3.y > 460) {
    monster3.vel.y = -3;
  }

  // Check for collision with monster3 or harmful platforms, reset game on collision
  if (player.collides(monster3)) {
    reset();
  }
  if (player.collides(platforms2)) {
    reset();
  }

  // Check if the player has collected all coins and won
  if (score == 3) {
    youWin(); // Trigger win condition
  }

  // Set camera to follow the player’s movement
  camera.x = player.x + 102;
}

/* FUNCTIONS */
// Load starting screen elements like platforms and coins
function loadStartScreen() {
  platforms.removeAll(); // Remove any existing platforms
  coins.removeAll(); // Remove any existing coins

  // Reposition player to the starting position
  player.x = 50;

  // Create platforms
  const platformData = [
    { x: 50, y: 380, w: 50, h: 20 },
     { x: 150, y: 450, w: 50, h: 20 },
     { x: 250, y: 450, w: 50, h: 20 },
     { x: 400, y: 450, w: 50, h: 20 },
    { x: 260, y: 200, w: 50, h: 30 },
    { x: 780, y: 380, w: 300, h: 40 },
    { x: 450, y: 330, w: 50, h: 50 },
    { x: 360, y: 200, w: 50, h: 30 },
    { x: 310, y: 310, w: 50, h: 100 },
    { x: 460, y: 200, w: 50, h: 30 },
  ];

  platformData.forEach(data => {
    new platforms.Sprite(data.x, data.y, data.w, data.h);
  });

  const platform2Data = [
    { x: 150, y: 285, w: 50, h: 10 },
    { x: 100, y: 100, w: 100, h: 30 },
    { x: 320, y: 100, w: 100, h: 30 },
    { x: 650, y: 200, w: 60, h: 30 },
    { x: 500, y: 100, w: 70, h: 30 },
    { x: 520, y: 350, w: 50, h: 30 },
    { x: 800, y: 120, w: 20, h: 390 },
    { x: 230, y: 710, w: 1500, h:30 }
  ];

  platform2Data.forEach(data => {
    new platforms2.Sprite(data.x, data.y, data.w, data.h);
  });

  // Create coins
  const coinData = [
    { x: 150, y: 315 },     { x: 260, y: 175 },
    { x: 450, y: 295 },     { x: 360, y: 175 },
    { x: 665, y: 330 },     { x: 460, y: 175 },

    { x: 400, y: 430 },
    { x: 250, y: 430 },
    { x: 155, y: 430 },
    
    { x: 650, y: 180 },
    { x: 310, y: 250 }, 
    { x: 520, y: 320 },
    
    { x: 110, y: 75 }, 
    { x: 320, y: 75 }, 
    { x: 500, y: 75 },//red
    { x: 900, y: 175 },
    
  ];

  coinData.forEach(data => {
    new coins.Sprite(data.x, data.y, 15); // Add coins to the game
  });
}

function reset() {
  score = 0;

  // Provide a short delay before resetting
  setTimeout(() => {
    loadStartScreen();
  }, 500); // 500 ms delay
}

function collect(player, coin) {
  coin.remove();
  score += 1;
  coinSound.play(); // Play sound when collecting a coin
}

function youWin() {
  // Draw sprites off screen
  monster3.x = 2000;
  player.x = 3000;

  // Draw end of game text
  textSize(20);
  fill(0);
  text("You win!", width / 2 - 50, height / 2 - 30);
  textSize(12);
  text("Press Run to interact with player.", width / 2 - 75, height / 2);

  // Show the "Run" button only when the game is won
  button.show();
}
// I might have added to much commemts , 
// That would be because i was trying to explain what each line of code does
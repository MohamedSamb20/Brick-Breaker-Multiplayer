/* global p5 */

// DO NOT DELETE THE FOLLOWING LINE
const p = new p5(() => {});

/*
Today's topics:

+ keyPressed() and mousePressed()
+ More HSB color mode
+ Mouse input data
+ random() function

*/

let backgroundColor;
let width, height;
width = 800;
height = 600;
let bricks, brickLength;
let leftPlayer, rightPlayer;
let leftBall, rightBall;
let inGame, startGame, compPlayer, singlePlay;
let redHeart, blueHeart;
p.setup = function() {
  // Canvas & color settings
  p.createCanvas(width, height);
  startGame = false;
  inGame = true;
  //function that sets up player, balls, and bricks
  createGameComponents();
  blueHeart = p.loadImage(
    "https://cdn.glitch.com/57f55b3b-b895-4e72-866d-f95fc2b51cb4%2Fexternal-content.duckduckgo.png?v=1595191432295"
  );
  redHeart = p.loadImage(
    "https://cdn.glitch.com/57f55b3b-b895-4e72-866d-f95fc2b51cb4%2Fexternal-content.duckduckgo-1.png?v=1595191432312"
  );
  compPlayer = new CompPlayer(
    width - 80,
    height - 130,
    10,
    80,
    p.color(255, 26, 26)
  );
};

p.draw = function() {
  p.background(0); //background is black

  p.fill(255, 255, 255);
  p.textSize(20);
  // p.text("Blue|" + leftPlayer.score + "-" + rightPlayer.score + "|Red",400,10);
  p.text("Blue | " + leftPlayer.score, width / 3 - 70, 40);
  p.text(rightPlayer.score + " | Red", (width * 2) / 3 - 20, 40);
  // p.text("Lives: " + leftPlayer.lives + "||" + rightPlayer.lives, 400, 30);
  drawLives();
  if (!startGame) {
    p.fill(255, 255, 255);
    p.textSize(20);
    p.text(
      "Press c to play against computer or spacebar for multiplayer",
      width * 0.15,
      260
    );
    p.fill(200, 200, 200);
    // p.textAlign(p.CENTER)
    p.textSize(15);
    // p.textAlign(p.CENTER)
    p.text("The goal is to break as many bricks and maintain as many lives as you can", width * 0.25, 300);
    p.text("Keys w and s move the blue player", width * 0.25, 330);
    p.text("Up and down arrow keys move the red player", width * 0.25, 350);
  }

  if (inGame && startGame) {
    leftPlayer.show(); //draws blue left player
    leftBall.show(); //draws blue left ball
    if (singlePlay) {
      compPlayer.show();
      compPlayer.move();
    } else rightPlayer.show(); //draws red right player
    rightBall.show(); //draws red right ball
    let i = 0;
    //   using a for of loop so that we don't iterate over null values
    for (let brick of bricks) {
      brick.drawBrick();
      //let collidedWithLeft
      brick.collideLeft(i);
      //let collidedWithRight
      brick.collideRight(i);
      i++;
    }

    moveBalls();
    checkIfKeyIsHeld();
    checkWin();
  } else if (!inGame && startGame) {
    if (leftPlayer.score > rightPlayer.score) {
      p.textSize(30);
      p.fill(255, 255, 255);
      p.text(
        "Blue Player wins! Press the c or spacebar to play again!",
        40,
        260
      );
    } else if (rightPlayer.score > leftPlayer.score) {
      p.textSize(30);
      p.fill(255, 255, 255);
      p.text(
        "Red Player wins! Press the c or spacebar to play again!",
        40,
        260
      );
    } else {
      p.textSize(30);
      p.fill(255, 255, 255);
      p.text(
        "It was a tie :(! Press the c or spacebar to play again!",
        40,
        260
      );
    }
    p.fill(200, 200, 200);
    p.textSize(15);
    p.text("The goal is to break as many bricks as you can", width * 0.25, 300);
    p.text("Keys w and s move the blue player", width * 0.25, 330);
    p.text("Up and down arrow keys move the red player", width * 0.25, 350);
  }
};
function drawLives() {
  let yPos = 30 + 5 * 3;
  console.log("Enters drawLives");
  for (var i = 0; i < leftPlayer.lives; i++) {
    p.image(blueHeart, 50, yPos + i * 25, 20, 20);
  }
  for (var i = 0; i < rightPlayer.lives; i++) {
    p.image(redHeart, width - 80, yPos + i * 25, 40, 40);
  }
}

function checkWin() {
  if (brickLength == 0 || leftPlayer.lives == 0 || rightPlayer.lives == 0) {
    inGame = false;
    if (leftPlayer.lives == 0) {
      leftPlayer.score -= 100;
    }
    if (rightPlayer.lives == 0) {
      rightPlayer.score -= 100;
    }
    leftPlayer.score += leftPlayer.lives * 50;
    rightPlayer.score += rightPlayer.lives * 50;
  }
}

function restartGame() {
  leftPlayer.y = 50;
  rightPlayer.y = height - 130;

  leftBall.x = 120;
  rightBall.x = width - 120;
  leftBall.y = 80;
  rightBall.y = height - 90;

  leftPlayer.score = 0;
  rightPlayer.score = 0;
  leftPlayer.lives = 3;
  rightPlayer.lives = 3;

  bricks = null;
  bricks = [];
  let x = 200;
  let y = 150;
  brickLength = 0;
  for (let i = 0; i < 70; i++) {
    bricks[i] = new Brick(x, y);
    brickLength++;
    if ((i + 1) % 10 == 0) {
      //restarts row every 10 blocks
      x = 200;
      y += 50;
    } else {
      x += 40;
    }
  }

  inGame = true;
}

function moveBalls() {
  leftBall.move();
  rightBall.move();
}

function checkIfKeyIsHeld() {
  if (p.keyIsDown(p.UP_ARROW)) {
    rightPlayer.move(1);
  }
  if (p.keyIsDown(p.DOWN_ARROW)) {
    rightPlayer.move(0);
  }

  if (p.keyIsDown(87)) {
    //if the key is w
    leftPlayer.move(1);
  }
  if (p.keyIsDown(83)) {
    //if the key is s
    leftPlayer.move(0);
  }
}

//   How the players move : 1 is up; 0 is down
p.keyPressed = function() {
  if (p.keyCode === p.UP_ARROW) {
    rightPlayer.move(1);
  } else if (p.key === p.DOWN_ARROW) {
    rightPlayer.move(0);
  } else if (p.key == "w") {
    leftPlayer.move(1);
  } else if (p.key == "s") {
    leftPlayer.move(0);
  } else if (p.keyCode == 32 && !inGame) {
    singlePlay = false;
    startGame = true;
    restartGame();
  } else if (p.keyCode == 32 && inGame) {
    singlePlay = false;
    startGame = true;
    console.log("registered that spacebar was pressed");
    restartGame();
    // startGame=true
  } else if (p.key == "c" && !inGame) {
    singlePlay = true;
    startGame = true;
    restartGame();
  } else if (p.key == "c") {
    singlePlay = true;
    startGame = true;
  }
};

function createGameComponents() {
  //create players
  leftPlayer = new Player(80, 50, 10, 80, p.color(0, 184, 230));
  rightPlayer = new Player(
    width - 80,
    height - 130,
    10,
    80,
    p.color(255, 26, 26)
  );

  //create balls
  leftBall = new Ball(120, 80, 30, p.color(0, 184, 230), 3, 4, false);
  rightBall = new Ball(
    width - 110,
    height - 90,
    30,
    p.color(255, 26, 26),
    -3,
    -4,
    true
  );

  //create bricks
  bricks = [];
  let x = 200;
  let y = 150;
  brickLength = 0;
  for (let i = 0; i < 70; i++) {
    bricks[i] = new Brick(x, y);
    brickLength++;
    if ((i + 1) % 10 == 0) {
      //restarts row every 10 blocks
      x = 200;
      y += 50;
    } else {
      x += 40;
    }
  }
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.side = 30;
    this.color = p.color(p.random(255), p.random(255), p.random(255)); //random color
  }

  drawBrick() {
    //function to draw the bricks
    p.noStroke();
    p.fill(this.color);
    p.rect(this.x, this.y, this.side, this.side);
  }

  collideLeft(a, compPlayer) {
    //check if the ball a block

    let leftHit = p.collideRectCircle(
      this.x,
      this.y,
      this.side,
      this.side,
      leftBall.x,
      leftBall.y,
      leftBall.diameter
    );

    if (leftHit) {
      leftPlayer.score += 10; //players score increases by 10 points
      bricks.splice(a, 1); //block is removed
      leftBall.xVelocity *= -1; //ball changes velocity
      brickLength--;
      //return true;//returns that the ball did hit the brick
    }
  }
  collideRight(a) {
    let rightHit = p.collideRectCircle(
      this.x,
      this.y,
      this.side,
      this.side,
      rightBall.x,
      rightBall.y,
      rightBall.diameter
    );

    if (rightHit) {
      rightPlayer.score += 10;
      bricks.splice(a, 1);
      rightBall.xVelocity *= -1;
      brickLength--;
      //return true;
    }
  }
}

class Player {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = c;
    this.score = 0;
    this.lives = 3;
  }

  move(val) {
    if (val == 1 && this.y > 0) this.y -= 10;
    else if (val == 0 && this.y < height - this.height) this.y += 10;
  }

  show() {
    // console.log("enters show")
    p.fill(this.color);
    p.rect(this.x, this.y, this.width, this.height);
  }
}

class CompPlayer {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = c;
    this.score = 0;
    this.lives = 3;
  }

  show() {
    // console.log("enters show")
    p.fill(this.color);
    p.rect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.y = rightBall.getY();
  }
}

class Ball {
  constructor(x, y, d, c, xV, yV, bL) {
    this.x = x;
    this.y = y;
    this.diameter = d;
    this.color = c;
    this.xVelocity = xV;
    this.yVelocity = yV;
    this.bounceLeft = bL;
    console.log(this.velocity);
  }

  computerMove() {}

  move() {
    if (this.x <= 0 || this.x >= width) {
      this.xVelocity *= -1;
    }

    if (this.y <= 0 || this.y >= height) {
      this.yVelocity *= -1;
    }

    if (this.bounceLeft) {
      let hitBlue = false;
      //if its a single player game or multiplayer then adjust the player dimensions
      if (singlePlay) {
        hitBlue = p.collideRectCircle(
          compPlayer.x,
          compPlayer.y,
          compPlayer.width,
          compPlayer.height,
          this.x,
          this.y,
          this.diameter
        );
      } else
        hitBlue = p.collideRectCircle(
          rightPlayer.x,
          rightPlayer.y,
          rightPlayer.width,
          rightPlayer.height,
          this.x,
          this.y,
          this.diameter
        );
      if (hitBlue) {
        this.xVelocity *= -1;
      }
      if (this.x >= width) {
        this.x = width - 110;
        rightPlayer.lives--;
      }
    } else {
      let hitRed = p.collideRectCircle(
        leftPlayer.x,
        leftPlayer.y,
        leftPlayer.width,
        leftPlayer.height,
        this.x,
        this.y,
        this.diameter
      );
      if (hitRed) {
        this.xVelocity *= -1;
      }
      if (this.x <= 0) {
        this.x = 120;
        leftPlayer.lives--;
      }
    }

    this.x += this.xVelocity;
    this.y += this.yVelocity;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setX(val) {
    this.x = val;
  }

  setY(val) {
    this.y = val;
  }
  getVelocity() {
    return this.velocity;
  }
  setVelocity(val) {
    this.velocity = val;
  }

  show() {
    p.fill(this.color);
    p.ellipse(this.x, this.y, this.diameter);
  }
}

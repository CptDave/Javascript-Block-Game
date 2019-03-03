//game.js
/*  Discription:  Player controls rectangle at bottom of game screen.
                Rectangles fall from the sky and need to be collected(physics?).
  Controls:     Use the mouse to move your player.
  Instructions: Catch the falling boxes, get good score?
*/

function start() {
  let canvas = document.getElementById("mycanvas");
  let scoreText = document.getElementById("score");
  canvas.width = Math.round(window.innerWidth / 2);
  canvas.height = Math.round(window.innerHeight / 1.5);
  let ctx = canvas.getContext("2d");
  let cWidth = canvas.width;
  let cHeight = canvas.height;
  let innerW = window.innerWidth;
  let gamePaused = false;
  let boxes = [];//Store all the boxes excluding the player
  let boxLimit = 100;
  let boxIncrement = 10;//stepping stone so the game doesnt run forever, used after game is unpaused
  let player = createBox();//The controllable box, the player.
  let score = 0;


  /*
    EVENT LISTENERS
  */
  //Called everytime the mouse moves over the canvas.
  //Used to move the player box
  canvas.addEventListener("mousemove", function (e) {
    if ((e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2) <= 0) {
      //console.log(e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2);
      player.x = 0;
    } else if((e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2) >= 700) {
      //console.log(e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2);
      player.x = 700;
    } 
    else {
      player.x = e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2;// - rec.left;
    }
    //console.log(e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2);
  });

  document.getElementById("body").addEventListener("touchstart", function(e) {
    if ((e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2) <= 0) {
      //console.log(e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2);
      player.x = 0;
    } else if((e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2) >= 700) {
      //console.log(e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2);
      player.x = 700;
    } 
    else {
      player.x = e.pageX - ((innerWidth - cWidth) / 2) - player.width / 2;// - rec.left;
    }
  });

  document.getElementById("body").addEventListener("touchmove", function(e) {
    player.x = e.touches[0].clientX;
  });

  //Called when the user clicks on the canvas
  //Used to pause the game
  canvas.addEventListener("click", function () {
    //Check to see if box limit has been reached.
    //If true, add 10 to boxlimit
    if (boxes.length >= boxLimit) { boxLimit += boxIncrement; }
    gamePaused = !gamePaused;
  })

  /*
      FUNCTION THAT RETURNS BOX OBJECT
      RETURN: BOX OBJECT
  */
  function createBox() {
    return {
      width: cWidth / 10,
      height: 15,
      x: 0,
      y: cHeight - 15,
      dx: 0,
      dy: 0,
      hooked: false,
      hookedByBox: false,
      checkDetection: function (p) {
        //Only check if the box is not hooked.
        //Because you only want to perform collision detection on falling blocks
        if (!this.hooked) {
          //console.log("!");
          //Check the bottom row of pixels against the latest
          // box in boxes - the latest one(the currently falling box)
          //If nothing in the boxes detect, check against player.
          let b = boxes;
          if (boxes.length >= 2) {
            //console.log("SUCCSESS4");
            //console.log(boxes.length - 2);
            //-2 because you dont want to check the falling box, only hooked boxes
            for (let i = boxes.length - 2; i >= 0; i--) {
              if (this.x + this.width >= b[i].x && this.x <= b[i].x + b[i].width) {
                if (this.y + this.height >= b[i].y && this.y + this.height <= b[i].y + 2) {
                  this.dx = this.x - p.x;
                  this.dy = this.y - p.y;
                  this.hooked = true;
                  score += 10;
                  scoreText.innerHTML = "Score: " + score;
                }
              }
            }
            if (this.x <= p.x + p.width && this.x + this.width >= p.x) {
              if (this.y + this.height >= p.y && this.y + this.height <= p.y + 2) {
                this.dx = this.x - p.x;
                this.dy = this.y - p.y;
                this.hooked = true;
                score += 10;
                scoreText.innerHTML = "Score: " + score;
              }
            }
          } else {
            //console.log("detect player");
            //X: Check if at any point along, box.x to box.x + box.width, is beneath the player
            //Y: Checks if at any point the bottom row of pixels for the box, is equal
            //   to one of the top 4 rows of pixels on the player.
            //This makes it so the boxes dont stick to the sides of the player,
            //making it feel a little more realistic, and "harder".
            if (this.x <= p.x + p.width && this.x + this.width >= p.x) {
              if (this.y + this.height >= p.y && this.y + this.height <= p.y + 2) {
                this.dx = this.x - p.x;
                this.dy = this.y - p.y;
                this.hooked = true;
                score += 10;
                scoreText.innerHTML = "Score: " + score;
              }
            }
          }
        }
      },
      fall: function (p) {
        //Movement function for all the blocks excluding player
        //Hooked box movement.
        if (this.hooked) {
          this.x = p.x + this.dx;
          this.y = p.y + this.dy;
        }
        //Not hooked box movement
        else if (!this.hooked) {
          this.y += 2;
          if (this.y > cHeight) {
            this.y = Math.floor((Math.random() * 50) + 1);
            this.x = Math.floor(((Math.random() * (cWidth - this.width)) + 1));
          }
        }
      },
      new: function () {
        //Mirge inside the property declaration of player object?
        //Esentially 'Spawn' 'data coordinants'
        //Used for the falling boxes, not the player
        this.width = ((Math.random() * 75) + 15);
        this.height = ((Math.random() * 75) + 15);
        this.x = Math.floor(((Math.random() * (cWidth - this.width)) + 1));
        this.y = Math.floor((Math.random() * 50) + 1);
      },
      render: function () {
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  };


  /*
      //FUNCTION TO UPDATE ALL THE BOXES
  */
  function updateBox() {
    //If the array holding all the boxes is empty, create a new box in it
    if (boxes[0] == null) {
      boxes.push(createBox());
      boxes[boxes.length - 1].new();
    }

    //If the last box is hooked, create and add a new box
    if (boxes[boxes.length - 1].hooked) {
      boxes.push(createBox());
      boxes[boxes.length - 1].new();
      boxes[boxes.length - 1].render();
    }

    //Loop through the array of boxes and perform detection, gravity and drawing
    for (let b in boxes) {
      boxes[b].checkDetection(player);
      boxes[b].fall(player);
      boxes[b].render();

    }
  }

  /*
  //  MAIN GAME LOOP
  //  CALLS THE UPDATE FUNCTIONS
  //  CLEARS AND DRAWS SCREEN
  */
  function run() {
    if (!gamePaused) {
      ctx.clearRect(0, 0, cWidth, cHeight);
      ctx.fillRect(player.x, player.y, player.width, player.height);

      if (boxes.length > boxLimit) {
        gamePaused = true;
      }

      updateBox();
    }
    requestAnimationFrame(run);
  }

  requestAnimationFrame(run);
}
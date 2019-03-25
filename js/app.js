
(function () {
  var requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

let testBox = document.getElementById('test');

//==================================================//
//-------------------Input Listeners----------------//

let input = new Input();

document.body.onkeydown = function(event) {
  input.SetKeys(event.which);
};

document.body.onkeyup = function(event) {
  input.DeleteKey(event.which);
};

//==================================================//
//----------------- main canvas --------------------//
let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
const width = 800; // 20 cols of 40px ?? const unsure
const height = 800; // if we want to go responsive
canvas.width = width;
canvas.height = height;

let gameBoard = new Board();
let player = new Player();

const rows = 20;
const cols = 20;
const cellSize = 40;
const rampSpeed = 10;
let rampCount = 0;
let rampMax = 30;
let speed = 1350;
let directions = [ 'up', 'down', 'right', 'left' ];
let blocks = [];
let blockID = 0;
let blockTimer = setInterval('AddBlock()', rampSpeed);
let lives = 4;

//==================================================//
//------------------ Game HUD's --------------------//
//==================================================// 

//-- this may change - HUD could go below? above? --//

//==================================================//
//------------------ Upper Left --------------------//

//==================================================//
//------------------ Upper Right -------------------//

//==================================================//
//------------------ Lower Reft --------------------//

//==================================================//
//------------------ Upper Right -------------------//


//==================================================//
//------------------>> DrawLives <<-----------------//
function DrawLives() {
  let heart1 = new Image();
  let heart2 = new Image();
  let heart3 = new Image();
  let heart4 = new Image();
  heart1.src = 'images/life.png';
  heart2.src = 'images/life.png';
  heart3.src = 'images/life.png';
  heart4.src = 'images/lostLife.png';
  ctx.beginPath();
  //--------->>  image    col   row  <<------------//
  ctx.drawImage(heart1, 9 * cellSize, 9 * cellSize);
  ctx.drawImage(heart2, 10 * cellSize, 9 * cellSize);
  ctx.drawImage(heart3, 9 * cellSize, 10 * cellSize);
  ctx.drawImage(heart4, 10 * cellSize, 10 * cellSize);
} // DrawLives()


//=================================================//
//----------------->> AddBlock <<------------------//
function AddBlock() {
  rampCount++;
  if(rampCount >= rampMax)
  {
    speed -= 100;
    if(speed <= 0)
    {
      speed = 100;
    }
    clearInterval(blockTimer);
    blockTimer = setInterval('AddBlock()', speed);
    rampCount = 0;
    rampMax = 20;
  }
  let dir = directions[ Math.floor(Math.random() * directions.length) ];
  let row; 
  let col;

  switch(dir) {
    case 'up': {
      row = 20;
      col = Math.floor((Math.random() * 12) + 4);
      break;
    }
    case 'down': {
      row = -1;
      col = Math.floor((Math.random() * 12) + 4);
      break;
    }
    case 'right': {
      row = Math.floor((Math.random() * 12) + 4);
      col = -1;
      break;
    }
    case 'left': {
      row = Math.floor((Math.random() * 12) + 4);
      col = 20;
      break;
    }
    default: {
      alert("No direction!");
    }
  } // switch

  // creates/adds block
  let block = new Block(dir, row, col, ++blockID);
  blocks.push(block);
  MoveBlocks();
} // AddBlocks()


//==================================================//
//----------------->> DrawBlocks <<-----------------//
function DrawBlocks() {
  ctx.clearRect(0, 0, width, height);
  DrawLives();
  for(let i = 0; i < blocks.length; i++) {
    let blockImage = new Image();

    switch(blocks[i].color) {
      case 'red': {
        blockImage.src = 'images/redBlock.png';   
        break;
      }
      case 'green': {
        blockImage.src = 'images/greenBlock.png';
        break;
      }
      case 'blue': {
        blockImage.src = 'images/blueBlock.png';
        break;
      }
      default: {
        alert("Ouch no color!");
      }
    } // switch
    ctx.beginPath();
    ctx.drawImage(blockImage, blocks[i].col * 40, blocks[i].row * 40);
  }
} // DrawBlocks()

function DrawPlayer() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  ctx.fillRect(player.GetCol() * 40, player.GetRow() * 40, 40, 40);
  ctx.strokeRect(0, player.GetRow() * 40, 800, 40);
  ctx.strokeRect(player.GetCol() * 40, 0, 40, 800);
} // DrawPlayer()


//=================================================//
//------------------>> KillBlocks <<---------------//
function KillBlocks() {
  for(let i = 0; i < blocks.length; i++)
  {
    if(blocks[i].row <= -2 || blocks[i].row >= 22
        || blocks[i].col <= -2 || blocks[i].col >= 22) {
          blocks.splice(i, 1);
          i--;
          console.log('killed it!');
        }
  }
} // KillBlocks()


//==================================================//
//------------------>> MoveBlocks <<----------------//
function MoveBlocks() {
  let moveCue = [];
  for(let i = 0; i < blocks.length; i++) {
    let dir = blocks[i].direction;
    let result;
    let offset = 1;
    let placed = false;

    // filter for newly added blocks only
    if(blocks[i].row <= -1 || blocks[i].row >= 20 || blocks[i].col <= -1 || blocks[i].col >= 20) {
      switch(dir) {
        case 'up': // row - offset
        {
          while(!placed)
          {
            result = gameBoard.CheckState(blocks[i].row - offset, blocks[i].col);
            if(result == 0) // nothing in the way
            {
              moveCue.push(blocks[i]);
              placed = true;
            }
            else // oops
            {
              // find the blocking block
              for(let b = 0; b < blocks.length; b++)
              {
                if(blocks[b].GetBlock(blocks[i].row - offset, blocks[i].col)) {
                  moveCue.push(blocks[b]);
                }
              }
              offset++; // so it walks up the cells
            }
          } // while
          offset = 1;
          break;
        }
        case 'down': // row + offset
        {
          while(!placed)
          {
            result = gameBoard.CheckState(blocks[i].row + offset, blocks[i].col);
            if(result == 0)
            {
              moveCue.push(blocks[i]);
              placed = true;
            }
            else
            {
              // find the blocking block
              for(let b = 0; b < blocks.length; b++)
              {
                if(blocks[b].GetBlock(blocks[i].row + offset, blocks[i].col)) {
                  moveCue.push(blocks[b]);
                }
              }
              offset++; // so it walks up the cells
            }
          } // while
          offset = 1;
          break;
        }
        case 'right': // col + offset
        {
          while(!placed)
          {
            result = gameBoard.CheckState(blocks[i].row, blocks[i].col + offset);
            if(result == 0)
            {
              moveCue.push(blocks[i]);
              placed = true;
            }
            else
            {
              // find the blocking block
              for(let b = 0; b < blocks.length; b++)
              {
                if(blocks[b].GetBlock(blocks[i].row, blocks[i].col + offset)) {
                  moveCue.push(blocks[b]);
                }
              }
              offset++; // so it walks up the cells
            }
          } // while
          offset = 1;
          break;
        }
        case 'left': // col - offset
        {
          while(!placed)
          {
            result = gameBoard.CheckState(blocks[i].row, blocks[i].col - offset);
            if(result == 0)
            {
              moveCue.push(blocks[i]);
              placed = true;
            }
            else
            {
              // find the blocking block
              for(let b = 0; b < blocks.length; b++)
              {
                if(blocks[b].GetBlock(blocks[i].row, blocks[i].col - offset)) {
                  moveCue.push(blocks[b]);
                }
              }
              offset++; // so it walks up the cells
            }
          } // while
          offset = 1;
          break;
        }
        default: // will never ever happen... ever ever ;)
        {
          alert('Out of your Mind!');
        }
      } // switch
    } // if
  } // for

  // finally shift blocks
  for(let i = moveCue.length - 1; i >= 0; i--)
  {
    moveCue[i].Move();
    gameBoard.ChangeState(moveCue[i].row, moveCue[i].col);
    gameBoard.SetColorCode(moveCue[i].row, moveCue[i].col, moveCue[i].GetBlockColor());
    gameBoard.SetBlockID(moveCue[i].row, moveCue[i].col, moveCue[i].GetBlockID());
  } // for
} // MoveBlocks()


//==================================================//
//------------------->> Update <<-------------------//
function Update() {
  DrawBlocks();
  DrawPlayer();
  KillBlocks();
  blocks = gameBoard.CheckBoard(blocks);
  requestAnimationFrame(Update); // self-calling
  UpdateTestBoard();
  input.CheckKeys();
} // Update()


//==================================================//
//------------> ONLOAD EVENT LISTENER <-------------//
window.addEventListener("load", function () {
  Update();
});


//==================================================//
//------------> COLLISION CHECK ALGO <--------------//
function CollCheck(shapeA, shapeB) {   
  var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2));
  var vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2));       
  var hWidths = (shapeA.width / 2) + (shapeB.width / 2);
  var hHeights = (shapeA.height / 2) + (shapeB.height / 2);
  var colDir = null;

  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      var oX = hWidths - Math.abs(vX);
      var oY = hHeights - Math.abs(vY);

      if (oX >= oY) {
          if (vY > 0) {
              colDir = "t"; // top
              shapeA.y += oY;
          }
          else {
              colDir = "b"; // bottom
              shapeA.y -= oY;
          }
      }
      else {
          if (vX > 0) {
              colDir = "l"; // left
              shapeA.x += oX;
          }
          else {
              colDir = "r"; // right
              shapeA.x -= oX;
          }
      }
  }
  return colDir;
} // ColCheck()


/////////////////////////////////////////////////////////
/////////////// BEWARE TESTING BELOW!!! /////////////////
//////////// Parental Discretion Advised! ///////////////
let cellID = 0;
let testID = 3;
let testState = true;
//================ Test Harness Created ================//
let testGrid = document.getElementById("testGrid");
for(let i = 0; i < 20; i++)
{
  for(let j = 0; j < 20; j++)
  {
    let cell = document.createElement('div');
    cell.setAttribute('id', cellID);
    cell.setAttribute('class', 'cell');
    testGrid.appendChild(cell);
    cellID++;
  }
}
// called from index duh
function SetTest(testType)
{
  testID = testType;
}
function ToggleTest()
{
  testState = !testState;
  if(testState) {
    testGrid.removeAttribute('class', 'hideTestGrid');
  }
  else {
    testGrid.setAttribute('class', 'hideTestGrid');
  }
}
function UpdateTestBoard()
{
  let activeCell = 0;
  for(let i = 0; i < 20; i++)
  {
    for(let j = 0; j < 20; j++)
    {
      let cell = document.getElementById(activeCell);
      if(testID == 0)
        cell.innerHTML = gameBoard.GetColorCode(i, j);
      else if(testID == 1)
        cell.innerHTML = gameBoard.GetState(i, j);
      else
        cell.innerHTML = gameBoard.GetBlockID(i, j);
      activeCell++;
    }
  }
}
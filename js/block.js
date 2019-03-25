
class Block {
  constructor(direction, row, col, id) {
    this.width = 40;
    this.height = 40;
    this.colorVals = [ 'red', 'green', 'blue' ];
    this.colorCodes = [ 0, 1, 2, 3]; // no-color, red, green, blue
    this.randVal = Math.floor(Math.random() * this.colorVals.length);
    this.color = this.colorVals[ this.randVal ];
    this.colorCode = this.colorCodes[ this.randVal + 1 ];
    this.direction = direction;
    this.row = row;
    this.col = col;
    this.id = id;
  }

  GetBlock(row, col) {
    if(this.row == row && this.col == col) {
      return this;
    }
  } // GetBlock()

  CheckPlaced() {
    return this.placed;
  } // CheckPlaced()

  SetPlaced() {
    this.placed = !this.placed;
  } // SetPlaced()

  GetBlockColor() {
    return this.color;
  }

  GetBlockID()
  {
    return this.id;
  }
  
  Move() {
    let dir = this.direction;
    switch(dir) {
      case 'right': {
        this.col++;
        break;
      }
      case 'down': {
        this.row++;
        break;
      }
      case 'left': {
        this.col--;
        break;
      }
      case 'up': {
        this.row--;
        break;
      }
      default: {
        // ouch
      }
    } // switch
  } // Move()
} // class
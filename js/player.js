
class Player {
  constructor()
  {
    this.row = 9;
    this.col = 9;
  } // constructor()

  // methods
  GetRow() {
    return this.row;
  }

  GetCol() {
    return this.col;
  }

  Move(dir) {
    switch (dir) {
      case 'left':
      {
        this.col--;
        if(this.col < 0)
          this.col = 0;
        break;
      }
      case 'right':
      {
        this.col++;
        if(this.col > 19)
          this.col = 19;
        break;
      }
      case 'up':
      {
        this.row--;
        if(this.row < 0)
          this.row = 0;
        break;
      }
      case 'down':
      {
        this.row++;
        if(this.row > 19)
          this.row = 19;
        break;
      }
      default:
        break;
    }
  }


} // class
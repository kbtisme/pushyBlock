
class Input {
    constructor() {
        this.keys = [];
    }

    CheckKeys() {
        if(this.keys[37] == true) {
            player.Move("left");
            delete this.keys[37];
        }
        if(this.keys[39] == true) {
            player.Move("right");
            delete this.keys[39];
        }
        if(this.keys[38] == true) {
            player.Move("up");
            delete this.keys[38];
        }
        if(this.keys[40] == true) {
            player.Move("down");
            delete this.keys[40];
        }
    }

    SetKeys(keyCode)
    {
        this.keys[keyCode] = true;
        console.log(keyCode);
    } // SetKeys()

    DeleteKey(keyCode)
    {
        delete this.keys[keyCode];
    } // DeleteKeys()
}
// Global variables
var hor = 8;    // Number of rows
var ver = 4;    // Number of columns/2 (this initializes a 8x8 board)

/* 
* Constructor of Game object
* Game initializes with a checkerboard in starting configuration
* If, for instance, the game is set to a 8x8 checkerboard, board is a
* 8x4 array filled with Space objects.
* Access a Space object with board[row][Math.floor(col/2)]
*/
function Game() {
    // Initialize an empty board hor x ver (8x4)
    this.board = new Array(0);
    for (var i=0; i<hor; i++) {
        this.board.push(new Array(ver));
    }

    // Generate Space objects and populate the board with them
    new Space(0, 0, this.board);
};

/* Game getters */
Game.prototype.getBoard = function() { return this.board; };
Game.prototype.getSpace = function(row, col) { return this.board[row][col]; };

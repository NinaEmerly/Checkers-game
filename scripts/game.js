// Global variables
var ver = 8;    // Number of rows
var hor = 4;    // Number of columns/2 (this initializes a 8x8 board)
var lines = 3;  // Number of lines of pieces each player starts out with (maximum: ver/2-1)

/* 
* Constructor of Game object
* Game initializes with a checkerboard in starting configuration
* If, for instance, the game is set to a 8x8 checkerboard, board is a
* 8x4 array filled with Space objects.
* Access a Space object with board[row][Math.floor(col/2)]
*/
function Game() { 
    var i, row, col, space;

    this.board = new Array(0);                  // Initialize an empty board hor x ver (8x4)
    for (i=0; i<ver; i++) {
        this.board.push(new Array(hor));
    }
    
    new Space(ver/2, hor-1, this.board);        // Generate a network of Space objects and populate the board with them

    for (row=0; row<lines; row++) {             // Create all pieces on own side
        for (col=0; col<hor; col++) {
            space = this.getSpace(row, col);
            space.setPiece(new PieceMan(true, space));
        }
    }
    console.log(this.board);
    for (row=ver-lines; row<ver; row++) {       // Create all pieces on opponent's side
        for (col=0; col<hor; col++) {
            space = this.getSpace(row, col);
            space.setPiece(new PieceMan(false, space));
        }
    }
};

/* Game getters */
Game.prototype.getBoard = function() { return this.board; };
Game.prototype.getSpace = function(row, col) { return this.board[row][col]; };
Game.prototype.getPiece = function(row, col) { return this.board[row][col].getPiece(); };

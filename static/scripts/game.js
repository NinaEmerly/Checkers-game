// Client-side
// Global variables
var ver = 8;    // Number of rows
var hor = 4;    // Number of columns/2 (this initializes a 8x8 board)
var lines = 3;  // Number of lines of pieces each player starts out with (maximum: ver/2-1)
var takenOwn, takenOpp = 0;     // takenOwn keeps count of own piece's taken off board, takenOpp keeps count of opponent's taken off board

/* 
* Constructor of Game object
* Game initializes with a checkerboard in starting configuration
* If, for instance, the game is set to a 8x8 checkerboard, board is a
* 8x4 array filled with Space objects.
* Access a Space object with board[row][Math.floor(col/2)]
*/
function Game() { 
    var i, row, col, space;

    this.board = new Array(0);                      // Initialize an empty board hor x ver (8x4)
    for (i = 0; i < ver; i++) {
        this.board.push(new Array(hor));
    }
    
    new Space(0, 1, this.board);                    // Generate a network of Space objects and populate the board with them

    for (row = 0; row < lines; row++) {             // Create all pieces on own side
        for (col = 0; col < hor; col++) {
            space = this.getSpace(row, col);
            space.setPiece(new PieceMan("A", space));
        }
    }
    console.log(this.board);
    for (row = ver-lines; row < ver; row++) {       // Create all pieces on opponent's side
        for (col = 0; col < hor; col++) {
            space = this.getSpace(row, col);
            space.setPiece(new PieceMan("B", space));
        }
    }
};

/* Game getters */
Game.prototype.getBoard = function() { return this.board; };
Game.prototype.getSpace = function(row, col) { return this.board[row][col]; };
Game.prototype.getPiece = function(row, col) { return this.board[row][col].getPiece(); };

/* Game setters */
Game.prototype.setPiece = function(row, col, piece) {
    var space = this.getSpace(row, col);
    if (!space.available) {                     // If this space is occupied
        space.getPiece().setSpace(null);        // Move the occupying piece off the board            
    }
    space.setPiece(piece);                      // Put the piece on the space
}

/*
*   movePiece removes the provided piece object from its prior space,
*   and adds it to the destination space. All fields are updated accordingly
*   Parameter piece: PieceMan or PieceKing object to move
*   Parameter destination: Space object selected to move this piece into
*   Throws exception if piece is not a PieceMan or PieceKing object
*   Throws exception if destination is not a Space object
*   Throws exception if destination is not a valid move
*/
Game.prototype.movePiece = function(piece, destination) {
    // Exception
    if (!(piece instanceof PieceMan)) {
        throw "Piece selected to move is not a PieceMan or PieceKing object";
    }
    // Pass on method
    piece.movePiece(destination);
}
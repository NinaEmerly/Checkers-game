var Space = require('./space');
var PieceMan = require('./pieceMan');
var PieceKing = require('./pieceKing');
var Scoreboard = require('./scoreboard');

/*
 * Constructor of Game object
 * Game initializes with a checkerboard in starting configuration
 * If, for instance, the Game is set to a 8x8 checkerboard, board is a
 * 8x4 array filled with Space objects.
 * Access a Space object with board[row][Math.floor(col/2)]
*/
function Game(gameID) {
    var i, row, col, space;

    this.playerA = null;                            // Set Player A
    this.playerB = null;                            // Set Player B
    this.id = gameID;                               // Set unique gameID
    this.gameState = "0 JOINED";                    // Initialize gamestate

    ver = 8;                                        // GLOBAL Number of rows
    hor = 4;                                        // GLOBAL Number of columns/2 (this initializes a 8x8 board)
    lines = 3;                                      // GLOBAL Number of lines of pieces each player starts out with (maximum: ver/2-1)

    // Initialize an empty board hor x ver (8x4)
    this.board = new Array(0);
    for (i = 0; i < ver; i++) {
        this.board.push(new Array(hor));
    }

    // Fill the board with spaces   
    new Space(0, 1, this.board);                    // Generate a network of Space objects and populate the board with them

    // Fill the spaces with pieces    
    for (row = 0; row < lines; row++) {             // Create all pieces on own side
        for (col = 0; col < hor; col++) {
            space = this.getSpace(row, col);
            space.setPiece(new PieceMan("A", space));
        }
    }
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
Game.prototype.getScore = function() { return Scoreboard.getScore(); };

/* Game setters */
Game.prototype.setPiece = function(row, col, piece) {
    var space = this.getSpace(row, col);
    if (!space.available) {                     // If this space is occupied
        space.getPiece().setSpace(null);        // Move the occupying piece off the board            
    }
    space.setPiece(piece);                      // Put the piece on the space
}

/*
 *  The game can be in a number of different states
 */
Game.prototype.transitionStates = {};
Game.prototype.transitionStates["0 JOINED"]  = 0;
Game.prototype.transitionStates["1 JOINED"]  = 1;
Game.prototype.transitionStates["2 JOINED"]  = 2;
Game.prototype.transitionStates["A MOVE"]   = 3;
Game.prototype.transitionStates["B MOVE"]   = 4;
Game.prototype.transitionStates["A WINS"]   = 5;
Game.prototype.transitionStates["B WINS"]   = 6;
Game.prototype.transitionStates["ABORTED"]  = 7;

Game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0],   // 0 JOINT
    [1, 0, 1, 0, 0, 0, 0, 0],   // 1 JOINT
    [0, 0, 0, 1, 1, 0, 0, 0],   // 2 JOINT
    [0, 0, 0, 0, 1, 1, 0, 1],   // A MOVE
    [0, 0, 0, 1, 0, 0, 1, 1],   // B MOVE
    [0, 0, 0, 0, 0, 0, 0, 0],   // A WINS
    [0, 0, 0, 0, 0, 0, 0, 0],   // B WINS
    [0, 0, 0, 0, 0, 0, 0, 0]    // ABORTED
];

/*
 *  Accepts two strings as transition states and returns a boolean on whether 'from' can transition to 'to'
 */

Game.prototype.isValidTransition = function (from, to) {

    // Assert that the parameters are string objects
    console.assert(typeof from == "string",
        "%s: Expecting a string, got a %s", arguments.callee.name, typeof from);
    console.assert(typeof to == "string",
        "%s: Expecting a string, got a %s", arguments.callee.name, typeof to);

    // Assert that the parameters are valid transition states
    console.assert(from in Game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state", arguments.callee.name, from);
    console.assert(to in Game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state", arguments.callee.name, to);
    
    // Define i, j. i is the row, and j the column in the transition matrix
    let i, j;
    if (! (from in Game.prototype.transitionStates)) {  // if 'from' not a valid transition state
        return false;                                   // return false
    } else {
        i = Game.prototype.transitionStates[from];      // i is the row
    }

    if (!(to in Game.prototype.transitionStates)) {     // if 'to' not a valid transition state
        return false;                                   // return false
    } else {
        j = Game.prototype.transitionStates[to];        // else, j is the column
    }

    return (Game.prototype.transitionMatrix[i][j] > 0); // return true or false depending on the corresponding element in the transition matrix
};

/*
 *  Returns a boolean on whether the parameter is a valid transition state
 */
Game.prototype.isValidState = function (s) {
    return (s in Game.prototype.transitionStates);
};

/*
 *  Changes the current game state
 *  Parameter w: String that is in the transitionStates array. This is the game state you want to transfer to
 */
Game.prototype.setStatus = function (w) {

    // Assert that the parameter is a string object
    console.assert(typeof w == "string",
        "%s: Expecting a string, got a %s", arguments.callee.name, typeof w);
    
    // Check if parameter is a valid transition state and if the current gamestate can transition into the parameter
    if (Game.prototype.isValidState(w) && Game.prototype.isValidTransition(this.gameState, w)) {
        this.gameState = w;                             // If so, change the game's gameState
        console.log("[STATUS] %s", this.gameState);
    } else {                                            // Else, raise an error
        return new Error("Impossible status change from %s to %s", this.gameState, w);
    }
};

/*
 *  Returns boolean value on whether this game currently has two connected players
 */
Game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == "2 JOINED");
};

/*
 *  Adds a player to the game
 *  Parameter p: a websocket that connects the player
 */
Game.prototype.addPlayer = function (p) {

    // Assert that the parameter is an object
    console.assert(p instanceof Object, "%s: Expecting an object (WebSocket), got a %s", arguments.callee.name, typeof p);

    // Exception if there are not 0 or 1 players connected
    if (this.gameState != "0 JOINED" && this.gameState != "1 JOINT") {
        return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
    }

    // Revise the game state
    var error = this.setStatus("1 JOINED");
    if(error instanceof Error) {
        this.setStatus("2 JOINED");
    }

    if (this.playerA == null) {     // If there is no player A yet
        this.playerA = p;           // This websocket becomes player A
        return "A";
    } else {                        // Else, there can't be a player B yet
        this.playerB = p;           // This websocket becomes player B
        return "B";
    }
};

/* Returns a human-friendly string of the checkerboard. For debugging purposes */
Game.prototype.toString = function() {
    var checkerboard = new String;  // Output string
    var piece                       // A reference to the current piece
    var pieceChar;                  // Character symbolizing a piece

    // Iterate over each space on the board and build the output string
    checkerboard = checkerboard.concat("    0o  0e  1o  1e  2o  2e  3o  3e\n");
    checkerboard = checkerboard.concat("  |---|---|---|---|---|---|---|---|\n");
    for (let row=0; row<ver; row++) {
        checkerboard = checkerboard.concat(row, " ");
        for (let col=0; col<hor; col++) {
            if (this.getPiece(row,col) === null) {
                pieceChar = "x";
            } else {
                piece = this.getPiece(row, col);
                if (piece.getTeam() === "A") {
                    pieceChar = "\x1b[4m\x1b[33m";  // underscore yellow
                    if (piece.getCrowned()) { pieceChar = pieceChar.concat("A"); }  // Case 1: team A's king
                    else                    { pieceChar = pieceChar.concat("a"); }  // Case 2: team A's man 
                } else {
                    pieceChar = "\x1b[4m\x1b[35m";  // underscore magenta
                    if (piece.getCrowned()) { pieceChar = pieceChar.concat("B"); }  // Case 3: team B's king
                    else                    { pieceChar = pieceChar.concat("b"); }  // Case 4: team B's man
                }
                pieceChar = pieceChar.concat("\x1b[0m");    // reset
            }

            if (row%2 === 0) {  // If row is even
                checkerboard = checkerboard.concat("|   | ", pieceChar, " ");
            } else {            // If row is odd
                checkerboard = checkerboard.concat("| ", pieceChar, " |   ");
            }
        }
        checkerboard = checkerboard.concat("|\n  |---|---|---|---|---|---|---|---|\n");
    }
    return checkerboard;
}

/*
*   movePiece removes the provided piece object from its prior space,
*   and adds it to the destination space. All fields are updated accordingly
*   Parameter piece: PieceMan or PieceKing object to move
*   Parameter row: row of the destination Space this piece moves into
*   Parameter col: column of the destination Space this piece moves into
*   Returns a boolean whether move was successful (i.e. is the destination a valid space for the piece to move in?)
*   Throws exception if piece is not a PieceMan or PieceKing object
*   Throws exception if destination is not a Space object
*   Throws exception if destination is not a valid move
*/
Game.prototype.movePiece = function(piece, row, col) {
   
    // Exception
    if (!(piece instanceof PieceMan)) {
        throw "Piece selected to move is not a PieceMan or PieceKing object";
    }

    destination = this.getSpace(row, col);  // Get destination Space object
    return piece.movePiece(destination);    // Pass on method
}

module.exports = Game;
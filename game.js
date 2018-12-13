/*  Serve- Side
 * Constructor of Game object
 * Game initializes with a checkerboard in starting configuration
 * If, for instance, the game is set to a 8x8 checkerboard, board is a
 * 8x4 array filled with Space objects.
 * Access a Space object with board[row][Math.floor(col/2)]
*/
var game = function (gameID) {
    var i, row, col, space;

    this.playerA = null;                            // Set Player A
    this.playerB = null;                            // Set Player B
    this.id = gameID;                               // Set unique gameID
    this.gameState = "0 JOINED";                    // Initialize gamestate

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
    console.log(this.board);
    for (row = ver-lines; row < ver; row++) {       // Create all pieces on opponent's side
        for (col = 0; col < hor; col++) {
            space = this.getSpace(row, col);
            space.setPiece(new PieceMan("B", space));
        }
    }

};

/*
 *  The game can be in a number of different states
 */
game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINED"]  = 0;
game.prototype.transitionStates["1 JOINED"]  = 1;
game.prototype.transitionStates["2 JOINED"]  = 2;
game.prototype.transitionStates["A MOVE"]   = 3;
game.prototype.transitionStates["B MOVE"]   = 4;
game.prototype.transitionStates["A WINS"]   = 5;
game.prototype.transitionStates["B WINS"]   = 6;
game.prototype.transitionStates["ABORTED"]  = 7;

game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0],   // 0 JOINT
    [1, 0, 1, 0, 0, 0, 0, 0],   // 1 JOINT
    [0, 0, 0, 1, 1, 0, 0, 0],   // 2 JOINT
    [0, 0, 0, 0, 1, 0, 0, 1],   // A MOVE
    [0, 0, 0, 1, 0, 0, 0, 1],   // B MOVE
    [0, 0, 0, 0, 0, 0, 0, 0],   // A WINS
    [0, 0, 0, 0, 0, 0, 0, 0],   // B WINS
    [0, 0, 0, 0, 0, 0, 0, 0]    // ABORTED
];

/*
 *  Accepts two strings as transition states and returns a boolean on whether 'from' can transition to 'to'
 */

game.prototype.isValidTransition = function (from, to) {

    // Assert that the parameters are string objects
    console.assert(typeof from == "string",
        "%s: Expecting a string, got a %s", arguments.callee.name, typeof from);
    console.assert(typeof to == "string",
        "%s: Expecting a string, got a %s", arguments.callee.name, typeof to);

    // Assert that the parameters are valid transition states
    console.assert(from in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state", arguments.callee.name, from);
    console.assert(to in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state", arguments.callee.name, to);
    
    // Define i, j. i is the row, and j the column in the transition matrix
    let i, j;
    if (! (from in game.prototype.transitionStates)) {  // if 'from' not a valid transition state
        return false;                                   // return false
    } else {
        i = game.prototype.transitionStates[from];      // i is the row
    }

    if (!(to in game.prototype.transitionStates)) {     // if 'to' not a valid transition state
        return false;                                   // return false
    } else {
        j = game.prototype.transitionStates[to];        // else, j is the column
    }

    return (game.prototype.transitionMatrix[i][j] > 0); // return true or false depending on the corresponding element in the transition matrix
};

/*
 *  Returns a boolean on whether the parameter is a valid transition state
 */
game.prototype.isValidState = function (s) {
    return (s in game.prototype.transitionStates);
};

/*
 * 
 */
game.prototype.setStatus = function (w) {

    // Assert that the parameter is a string object
    console.assert(typeof w == "string",
        "%s: Expecting a string, got a %s", arguments.callee.name, typeof w);
    
    // Check if parameter is a valid transition state and if the current gamestate can transition into the parameter
    if (game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)) {
        this.gameState = w;                             // If so, change the game's gameState
        console.log("[STATUS] %s", this.gameState);
    } else {                                            // Else, raise an error
        return new Error("Impossible status change from %s to %s", this.gameState, w);
    }
};

/*
 *  Returns boolean value on whether this game currently has two connected players
 */
game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == "2 JOINED");
};

game.prototype.addPlayer = function (p) {

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

module.exports = game;              // Make this file available as a module to other files

// FROM HERE ON, THE CODE WAS COPIED FROM CLIENTSIDE 

// Global variables (hoisted to the top)
var ver = 8;    // Number of rows
var hor = 4;    // Number of columns/2 (this initializes a 8x8 board)
var lines = 3;  // Number of lines of pieces each player starts out with (maximum: ver/2-1)
var takenOwn, takenOpp = 0;     // takenOwn keeps count of own piece's taken off board, takenOpp keeps count of opponent's taken off board


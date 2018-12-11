/*
 *  Constructor of the game object
 */
var game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 JOINT";
};

/*
 *  The game can be in a number of different states
 */
game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINT"]  = 0;
game.prototype.transitionStates["1 JOINT"]  = 1;
game.prototype.transitionStates["2 JOINT"]  = 2;
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
    return (this.gameState == "2 JOINT");
};

game.prototype.addPlayer = function (p) {

    // Assert that the parameter is an object
    console.assert(p instanceof Object, "%s: Expecting an object (WebSocket), got a %s", arguments.callee.name, typeof p);

    // Exception if there are not 0 or 1 players connected
    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
        return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
    }

    // Revise the game state
    var error = this.setStatus("1 JOINT");
    if(error instanceof Error) {
        this.setStatus("2 JOINT");
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
// Modules and packages
var express = require("express");
var websocket = require("ws");
var http    = require("http");

var Space       = require("./gamescripts/space");
var Game        = require("./gamescripts/game");
var Move        = require("./gamescripts/move");
var PieceMan    = require("./gamescripts/pieceMan");
var PieceKing   = require("./gamescripts/pieceKing");

var indexRouter = require("./routes");
/*TODO
var messages = require("./static/scripts/messages");
*/
var gameStatus = require("./statTracker");

// Command line argument
var port = process.argv[2];             // Which port to listen to

// Set up Express
var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/static"));
app.get("/splash", indexRouter);
app.get("/game", indexRouter);
/*TODO: splash.ejs
app.get("/", (req, res) => {
    res.render("splash.ejs", { onlinePlayers: gameStatus.onlinePlayers, ongoingGames: gameStatus.ongoingGames, enqueuedPlayers: gameStatus.enqueuedPlayers });
})
*/

// Launch the server
var server = http.createServer(app);
const wss = new websocket.Server({ server });

// Initialize an array containing all players (websockets) and which game objects they are linked with
var websockets = {};

/*
 *  Regularly clean up the websockets object
 */
setInterval(function() {
    for(let i in websockets){
        if(websockets.hasOwnProperty(i)){
            let gameObj = websockets[i];
            //if the gameObj has a final status, the game is complete/aborted
            if(gameObj.finalStatus!=null){
                console.log("\tDeleting element "+i);
                delete websockets[i];
            }
        }
    }
}, 60000);

var currentGame = new Game(gameStatus.gamesInitialized++);  // Initialize a game object with a unique id
var connectionID = 0;                                       // Initialize a global variable that tracks a unique id for each websocket

/*
*   Event: A client connects to the server
*/
wss.on("connection", function connection(ws) {
    console.log("Connection state: " + ws.readyState);
    
    /* Two-player game: every two players are added to the same game */
    let con = ws;                       // Copy the websocket to a local variable
    con.id  = connectionID++;           // Set a unique id
    let playerType      = currentGame.addPlayer(con);   // Adds websocket to current game. playerType is "A" or "B" depending on which was assigned to socket
    websockets[con.id]  = currentGame;  // Add the game object to the websockets array at the index of the player's id

    console.log("Player %s placed in game %s as %s", con.id, currentGame.id, playerType);
    
    /* Inform the client about its assigned player type */
    /*TODO
    con.send((playerType == "A") ? messages.S_Player_A : messages.S_PLAYER_B);
    */

    /* Once we have two players, there is no way back;
     * a new game object is created;
     * if a player now leaves, the game is aborted (player is not preplaced)
     */
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);      // Change global variable and go to next game object
    }

    /*
     * message coming in from a player:
     *  1. determine the game object
     *  2. determine the opposing player OP
     *  3. send the message to OP 
     */
    /*
    con.on("message", function incoming(message)) {
        TODO
    }
    */

    /*
     *  Event: either player disconnects
     */
    con.on("close", function (code) {
        
        console.log(con.id + " disconnected");

        if (code == "1001") {   // if closing initiated by the client
            /* If possible, abort the game; if not, the game is already completed */
            let gameObj = websockets[con.id];

            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED");
                gameStatus.gamesAborted++;

                /* 
                 * Determine whose connection remains open;
                 * close it
                 */
                try {
                    gameObj.playerA.close();
                    gameObj.playerA = null;
                } catch(e) {
                    console.log("Player A closing: " + e);
                }

                try {
                    gameObj.playerB.close();
                    gameObj.playerB = null;
                } catch(e) {
                    console.log("Player B closing: " + e);
                }
            }
        }
    });
});

server.listen(port)                     // Receive data
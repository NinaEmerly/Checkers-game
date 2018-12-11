/* 
 *  In-memory game statistics "tracker".
 *  As future work, this object should be replaced by a DB backend.
 */

var gameStatus = {
    since               : Date.now(),   /* since we keep it simple and in-memory, keep track of when this object was created */
    gamesInitialized    : 0,            /* number of games that have been initialized */
    onlinePlayers       : 0,            /* number of players currently connected */
    ongoingGames        : 0,            /* number of games currently active */
    enqueuedPlayers     : 0             /* number of connected players waiting to begin a game */
};

module.exports = gameStatus;            /* Make this file available as a module to other files */
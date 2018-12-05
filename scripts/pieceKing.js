/*
*   Constructs a pieceKing: gamepiece which is a king
*   pieceKing inherits from pieceMan
*/
function pieceKing(own, space) {
    pieceMan.call(this, own, space);
}

/*  redirect prototype */
pieceKing.prototype = Object.create(pieceMan.prototype);
pieceKing.prototype.constructor = pieceKing;

pieceKing.prototype.diagonalValidMoves = function(i) {

}

/*  @Overwrite
*   validMoves checks if the spaces in a diagonal line from this gamepiece are unoccupied
*   and looks for possible opponent's pieces that can be taken
*   Returns: an array of valid destinations for this gamepiece to move in
*/
pieceKing.prototype.validMoves = function() {
    // Initialize variables
    var neighbor;
    var destinations = new Array(0);

    // Iterate over neighbors
    for (var i=0; this.neighbors.length; i++) {
        
    }
    return destinations;
}
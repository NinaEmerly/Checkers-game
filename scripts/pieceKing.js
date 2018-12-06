/*
*   Constructs a PieceKing: gamepiece which is a king
*   PieceKing inherits from PieceMan
*/
function PieceKing(own, space) {
    PieceMan.call(this, own, space);
}

/*  redirect prototype */
PieceKing.prototype = Object.create(PieceMan.prototype);
PieceKing.prototype.constructor = PieceKing;

/*  @Overwrite
*   validMoves checks if the spaces in a diagonal line from this gamepiece are unoccupied
*   and looks for possible opponent's pieces that can be taken
*   Returns: an array of valid destinations for this gamepiece to move in
*/
PieceKing.prototype.validMoves = function() {
    // Initialize variables
    var neighbor;
    var destinations = new Array(0);

    // Iterate over all directions
    for (var i=0; i<=4; i++) {
        neighbor = this.space.neighbors[i];                             // 'neighbor' is the closest space in that direction

        // Add all unoccupied spaces in that direction to valid destinations
        while (neighbor instanceof Space && neighbor.getAvailable()) {  // While neighbor is a space on the board and unoccupied
            destinations.push(neighbor)                                 // Add this neighbor to valid destinations
            neighbor = neighbor.getNeighbors()[i];                      // Go to next neighbor in the same direction
        }
        // The loop encountered an obstruction 
        // Case 1: neighbor is occupied by own piece or not on the board
        if (!(neighbor instanceof Space) || neighbor.getOccupiedOwn()) {
            continue;                                                   // Do nothing: neighbor is not a valid destination
        }
        // Case 2: neighbor is occupied by opponent's piece
        if (neighbor.getOccupiedOpp()) {
            neighbor = neighbor.getNeighbors()[i];
            if (neighbor instanceof Space && neighbor.getAvailable()) { // If neighbor is unoccupied and on the board
                destinations.push(neighbor)                             // Add the conjunt neighbor to valid destinations
            } else continue;                                            // Else do nothing: neighbor is not a valid destination
        }
    }
    return destinations;
}
/*
*   Constructs a PieceKing: gamepiece which is a king
*   PieceKing inherits from PieceMan
*/
function PieceKing(team, other, space) {
    PieceMan.call(this, team, other, space);
}

/*  redirect prototype */
PieceKing.prototype = Object.create(PieceMan.prototype);
PieceKing.prototype.constructor = PieceKing;

/*  @Override
*   validMoves checks if the spaces in a diagonal line from this gamepiece are unoccupied
*   and looks for possible opponent's pieces that can be taken
*   Returns: an array of Move objects with valid moves for this gamepiece to move in and whether this move takes an opponent's piece
*/
PieceKing.prototype.validMoves = function() {
    // Initialize variables
    var neighbor, i, takenPiece;
    var validMoves = new Array(0);

    // Iterate over all directions
    for (i=0; i<=3; i++) {
        neighbor = this.space.neighbors[i];                             // 'neighbor' is the closest space in that direction

        // Add all unoccupied spaces in that direction to valid moves
        while (neighbor instanceof Space && neighbor.getOccupiedTeam() === "NONE") {  // While neighbor is a space on the board and unoccupied
            validMoves.push(new Move(neighbor, false, null))            // Add this neighbor to valid moves
            neighbor = neighbor.getNeighbors()[i];                      // Go to next neighbor in the same direction
        }
        // The loop encountered an obstruction 
        // Case 1: neighbor is occupied by same team's piece or not on the board
        if (!(neighbor instanceof Space) || neighbor.getOccupiedTeam() === this.team) {
            continue;                                                   // Do nothing: neighbor is not a valid move
        }
        // Case 2: neighbor is occupied by opponent's piece
        if (neighbor.getOccupiedTeam() === this.other) {
            takenPiece = neighbor.getPiece();
            neighbor = neighbor.getNeighbors()[i];
            if (neighbor instanceof Space && neighbor.getOccupiedTeam() === "NONE") { // If neighbor is unoccupied and on the board
                validMoves.push(new Move(neighbor, true, takenPiece))   // Add the conjunt neighbor to valid moves
            } else continue;                                            // Else do nothing: neighbor is not a valid move
        }
    }
    return validMoves;
}

/*  @Override
*   crown changes a pieceMan to pieceKing object, but is obsolete for this object
*/
PieceKing.prototype.crown = function() {
    return this;
}
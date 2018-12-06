/*
*   Constructs a PieceMan object: gamepiece which is a man
*   Prototype of this object is inherited by gamepiece king
*   Parameter own: boolean, true if owned, else if opponent's
*/
function PieceMan(own, space) {
    this.own = own;
    this.space = space;
}

/* PieceMan getters */
PieceMan.prototype.getOwn = function() { return this.own; };
PieceMan.prototype.getSpace = function() { return this.space; };

/* PieceMan setters */
PieceMan.prototype.setOwn = function(own) { this.own = own; };
PieceMan.prototype.setSpace = function(space) {
    this.space = space;                     // The new piece is moved into this space
    if (this.space.getPiece() !== this) {   // (This line to prevent an infinite loop)
        this.space.setPiece(this);          // Bind the space to this piece
    }
};

/*
*   validMoves checks if the neighboring spaces of this gamepiece are unoccupied
*   and looks for possible opponent's pieces that can be taken
*   Returns: an array of valid destinations for this gamepiece to move in
*/
PieceMan.prototype.validMoves = function() {
    // Initialize variables
    var neighbor, i;
    var destinations = new Array(0);

    // Iterate over forward neighbors
    for (i=0; i<=1; i++) {
        neighbor = this.space.neighbors[i];

        // Case 1: neighbor is occupied by own piece or not on board
        if (!(neighbor instanceof Space) || neighbor.getOccupiedOwn()) {
            continue;                                                   // Do nothing: neighbor is not a valid destination
        }

        // Case 2: neighbor is unoccupied
        if (neighbor.getAvailable()) {
            destinations.push(neighbor);                                // Add this neighbor to valid destinations
            continue;                                                   // Go to next neighbor
        }
    }
    // Iterate over all neighbors
    for (i=0; i<=3; i++) {
        neighbor = this.space.neighbors[i];

        // Case 1: neighbor is not on the board
        if (!(neighbor instanceof Space)) {
            continue;                                                   // Do nothing: neighbor is not a valid destination
        }
        // Case 3: neighbor is occupied by opponent's piece
        if (neighbor.getOccupiedOpp()) {
            neighbor = neighbor.getNeighbors()[i];                        // Go to next conjunct space   
            if (neighbor instanceof Space && neighbor.getAvailable()) { // If conjunct space is unoccupied and on the board
                destinations.push(neighbor)                             // Add the conjunt neighbor to valid destinations
            }                                                           // Else do nothing: neighbor is not a valid destination
        }
    }
    return destinations;
}

/*
*   movePiece removes this Piece object from its prior space,
*   and adds it to the destination space. All fields are updated accordingly
*   Parameter destination: Space object selected to move this piece into
*   Throws exception if destination is not a Space object
*   Throws exception if destination is not a valid move
*/
PieceMan.prototype.movePiece = function(destination) {
    // Exceptions
    if (!(destination instanceof Space)) {
        throw "Selected destination is not a Space object";
    }
    if (!this.validMoves().includes(destination)) {         // If selected move is not valid
        throw "Selected move is not a valid destination";   // Throw exception
    }

    // Everything is in order
    this.space.setPiece(null);                              // Clear the piece's prior space
    destination.setPiece(this);                             // Move the piece in new space
    // Space and Piece are updated to reference each other
    //TODO ability to take opponent's pieces
}
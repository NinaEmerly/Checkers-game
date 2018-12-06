/*
*   Constructs a PieceMan object: gamepiece which is a man
*   Prototype of this object is inherited by gamepiece king
*   Parameter own: boolean, true if owned, else false if opponent's
*   Parameter space: Space object, location of this piece on the board
*   taken: boolean, true if this piece is taken, else false
*/
function PieceMan(own, space) {
    this.own = own;
    this.space = space;
    this.taken = false;
}

/* PieceMan getters */
PieceMan.prototype.getOwn = function() { return this.own; };
PieceMan.prototype.getSpace = function() { return this.space; };
PieceMan.prototype.getTaken = function() { return this.taken; };

/* PieceMan setters */
PieceMan.prototype.setOwn = function(own) { this.own = own; };
PieceMan.prototype.setSpace = function(space) {
    this.space = space;                     // The piece is moved into this space
    if (this.space.getPiece() !== this) {   // (This line to prevent an infinite loop)
        this.space.setPiece(this);          // Bind the space to this piece
    }
    if (this.space.row === ver-1) {         // If this piece reaches the farthest row
        this.crown();                       // Crown this piece (put a new PieceKing object in its space)
    }
};
PieceMan.prototype.setTaken = function(taken) { this.taken = taken; };

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

    // Method
    this.space.setPiece(null);                              // Clear the piece's prior space
    destination.setPiece(this);                             // Move the piece in new space
    // Space and Piece are updated to reference each other
    //TODO ability to take opponent's pieces
}

/*
*   crown changes this object's instance from PieceMan to PieceKing
*   !!! Remember, if a variable references this object,
*   !!! change that reference to the new king object after calling this method.
*   !!! that way, this object is cleared for the garbage collector
*   Throws exception if this piece has been taken
*/
PieceMan.prototype.crown = function() {
    // Initialize
    var king;

    // Exception
    if (this.taken === true) {
        throw "Ignoring attempt to crown a taken piece";
    }

    // Method
    king = new PieceKing(this.own, null);
    king.setSpace(this.space);              // Binds new king to this piece's space
    this.space = null;                      // Disconnect this piece from board
}
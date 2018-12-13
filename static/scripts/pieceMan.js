/*
*   Constructs a PieceMan object: gamepiece which is a man
*   Prototype of this object is inherited by gamepiece king
*   Parameter team: Character, "A" if player A's, "B" if player B's
*   Parameter other: Character, opposite team of 'team'
*   Parameter space: Space object, location of this piece on the board.
*   The Space object which this piece references will refer this piece as well
*/
function PieceMan(team, space) {
    this.team = team;
    if (team == "A") {
        this.other == "B";
    } else {
        this.other == "A";
    }
    this.setSpace(space);
}

/* PieceMan getters */
PieceMan.prototype.getTeam = function() { return this.team; };
PieceMan.prototype.getOther = function() { return this.other; };
PieceMan.prototype.getSpace = function() { return this.space; };

/* PieceMan setters */
PieceMan.prototype.setTeam = function(team) { this.team = team; };
PieceMan.prototype.setOther = function(other) { this.other = other; };
PieceMan.prototype.setSpace = function(space) {
    this.space = space;                         // The piece is moved into this space
    if (this.space instanceof Space) {          // If the new space is a Space object (not null)
        if (this.space.getPiece() !== this) {   // (This line to prevent an infinite loop)
            this.space.setPiece(this);          // Bind the space to this piece
        }
        if (this.space.row === ver-1) {         // If this piece reaches the farthest row
            this.crown();                       // Crown this piece (put a new PieceKing object in its space)
        }
    }
};

/*
*   validMoves checks if the neighboring spaces of this gamepiece are unoccupied
*   and looks for possible opponent's pieces that can be taken
*   Returns: an array of Move objects with valid moves for this gamepiece to move in and whether this move takes an opponent's piece
*/
PieceMan.prototype.validMoves = function() {
    // Initialize variables
    var neighbor, i, takenPiece;
    var validMoves = new Array(0);

    // Iterate over forward neighbors
    for (i = 0; i <= 1; i++) {
        neighbor = this.space.neighbors[i];

        // Case 1: neighbor is occupied by same team's piece or not on board
        if (!(neighbor instanceof Space) || neighbor.getOccupiedTeam() == this.team) {
            continue;                                                   // Do nothing: neighbor is not a valid move
        }

        // Case 2: neighbor is unoccupied
        if (neighbor.getOccupiedTeam() == "NONE") {
            validMoves.push(new Move(neighbor, false, null));           // Add this neighbor to valid moves
            continue;                                                   // Go to next neighbor
        }
    }
    // Iterate over all neighbors
    for (i = 0; i <= 3; i++) {
        neighbor = this.space.neighbors[i];

        // Case 1: neighbor is not on the board
        if (!(neighbor instanceof Space)) {
            continue;                                                   // Do nothing: neighbor is not a valid move
        }
        // Case 3: neighbor is occupied by opponent's piece
        if (neighbor.getOccupiedTeam() == this.other) {
            takenPiece = neighbor.getPiece();                           // Save a reference to opponent's piece that can be taken with this move
            neighbor = neighbor.getNeighbors()[i];                      // Go to next conjunct space   
            if (neighbor instanceof Space && neighbor.getAvailable()) { // If conjunct space is unoccupied and on the board
                validMoves.push(new Move(neighbor, true, takenPiece));  // Add the conjunt neighbor to valid moves and pass a reference to taken piece
            }                                                           // Else do nothing: neighbor is not a valid move
        }
    }
    return validMoves;
}

/*
*   movePiece removes this Piece object from its prior space,
*   and adds it to the destination space. All fields are updated accordingly
*   Parameter destination: Space object selected to move this piece into
*   Throws exception if destination is not a Space object
*   Throws exception if destination is not a valid move
*/
PieceMan.prototype.movePiece = function(destination) {
    var validMoves, move;
    validMoves = this.validMoves();
    
    // Exceptions
    if (!(destination instanceof Space)) {
        throw "Selected destination is not a Space object";
    }
    for (var i=0; i<validMoves.length; i++) {
        if (validMoves[i].getDestination() === destination) {
            move = validMoves[i];
        }
    }
    if (!(move instanceof Move)) {                          // If selected move is not valid
        throw "Selected move is not a valid destination";   // Throw exception
    }

    // Method
    if (move.take === true) {                               // If a piece is taken during this move
        move.getTakenPiece().getSpace().setPiece(null);     // Clear the piece off the board
        move.getTakenPiece().setSpace(null)                 // Clear the board off the piece
        takenOpp++;                                         // Increase counter
    }
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
    king = new PieceKing(this.team, null);
    king.setSpace(this.space);              // Binds new king to this piece's space
    this.space = null;                      // Disconnect this piece from board
    return king;
}
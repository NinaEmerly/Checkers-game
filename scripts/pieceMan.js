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
PieceMan.prototype.setSpace = function(Space) { this.space = space; };

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
    for (i=0; i<=2; i++) {
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
    for (i=0; i<=4; i++) {
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
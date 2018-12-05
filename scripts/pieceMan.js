/*
*   Constructs a pieceMan object: gamepiece which is a man
*   Prototype of this object is inherited by gamepiece king
*   Parameter own: boolean, true if owned, else if opponent's
*/
function pieceMan(own, space) {
    this.own = own;
    this.space = space;
}

/* pieceMan getters */
pieceMan.prototype.getOwn = function() { return this.own; };
pieceMan.prototype.getSpace = function() { return this.space; };

/* pieceMan setters */
pieceMan.prototype.setOwn = function(own) { this.own = own; };
pieceMan.prototype.setSpace = function(Space) { this.space = space; };

/*
*   validMoves checks if the neighboring spaces of this gamepiece are unoccupied
*   and looks for possible opponent's pieces that can be taken
*   Returns: an array of valid destinations for this gamepiece to move in
*/
pieceMan.prototype.validMoves = function() {
    // Initialize variables
    var neighbor;
    var destinations = new Array(0);

    // Iterate over neighbors
    for (var i=0; this.neighbors.length; i++) {
        neighbor = this.neighbors[i];
        // Case 1: neighbor is unoccupied
        if (neighbor.getAvailable()) {
            destinations.push(neighbor);                        // Append this neighbor to valid destinations
            continue;                                           // Go to next neighbor
        }
        // Case 2: neighbor is occupied by own piece
        if (neighbor.getOccupiedOwn()) {
            continue;                                           // Do nothing: neighbor is not a valid destination
        }
        // Case 3: neighbor is occupied by opponent's piece
        if (neighbor.getOccupiedOpp()) {
            if (neighbor.getNeighbors()[i].available) {         // Check if conjunct space is unoccupied
                destinations.push(neighbor.getNeighbors()[i]);  // Append the conjunct neighbor to valid destinations
            } else continue;                                    // Else do nothing: neighbor is not a valid destination
        }
    }
    return destinations;
}

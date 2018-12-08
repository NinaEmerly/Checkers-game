/* Constructor of move object */
function Move(destination, take, takenPiece) {
    this.destination = destination;             // Space object, the space the piece moves in
    this.take = take;                           // Boolean, does this move take an opponent's piece?
    this.takenPiece = takenPiece                // PieceMan or PieceKing object that will be taken in this move, or null if none is taken
}

/* Getters */
Move.prototype.getDestination = function() { return this.destination; };
Move.prototype.getTake = function() { return this.take; };
Move.prototype.getTakenPiece = function() { return this.takenPiece; };

/* Setters */
Move.prototype.setDestination = function(destination) { this.destination = destination; };
Move.prototype.setTake = function(take) { this.take = take; };
Move.prototype.setTakenPiece = function(takenPiece) { this.takenPiece = takenPiece; };
/*
* Constructor of Space object
* Constructing a single space somewhere on the checkerboard will also
* create and network all other spaces on the board
* Parameter row: integer horizontal position on board
* Parameter col: integer vertical position on board
* Parameter board: Space array of the checkerboard
*/
function Space(row, col, board) {
    board_col = Math.floor(col/2);
    board[row][board_col] = this;                               // Register this Space on board
    this.row = row;                                             // integer horizontal position on board
    this.col = board_col;                                       // integer vertical position on board
    this.occupiedOwn = false;                                   // boolean, space is occupied by own piece
    this.occupiedOpp = false;                                   // boolean, space is occupied by opponent's piece
    this.available = true;                                      // boolean, space is unoccupied
    this.piece = null;                                          // PieceObject that occupies this space, if any
    
    var ur_row = row + 1;
    var ur_col = col + 1;
    var ll_row = row - 1;
    var ll_col = col - 1;
    var ur_Space = getNeighbor(ur_row, ur_col, board);
    var ul_Space = getNeighbor(ur_row, ll_col, board);
    var ll_Space = getNeighbor(ll_row, ll_col, board);
    var lr_Space = getNeighbor(ll_row, ur_col, board);
    this.neighbors = [ur_Space, ul_Space, ll_Space, lr_Space];  // array of references to adjacent spaces [ur, ul, ll, lr]
}

/* Space getters */
Space.prototype.getRow = function() { return this.row; };
Space.prototype.getCol = function() { return this.col; };
Space.prototype.getNeighbors = function() { return this.neighbors; };
Space.prototype.getOccupiedOwn = function() { return this.occupiedOwn; };
Space.prototype.getOccupiedOpp = function() { return this.occupiedOpp; };
Space.prototype.getAvailable = function() { return this.available; };
Space.prototype.getPiece = function() { return this.piece; };

/* Space setters */
Space.prototype.setRow = function(row) { this.row = row; };
Space.prototype.setCol = function(col) { this.col = col; };

/* Throws exception if piece is none of PieceMan, PieceKing or null */
Space.prototype.setPiece = function(piece) {
    // Exception
    if (!(piece instanceof PieceMan) && piece !== null) {
        throw ("Ignored to attempt set piece of Space: " + this + " to: " + piece);
    }

    if (piece instanceof PieceMan) {        // If a new piece is set in this space
        this.occupiedOwn = piece.own;       // Update relevant information
        this.occupiedOpp = !piece.own;
        this.available = false;
    } else if (piece === null) {            // Else if this space is cleared
        this.occupiedOwn = false;           // Update relevant information
        this.occupiedOpp = false;
        this.available = true;
    }
    this.piece = piece;                     // The new piece is moved in this space
    if (piece instanceof PieceMan && this.piece.getSpace() !== this) {   // (This line to prevent an infinite loop)
        this.piece.setSpace(this);          // Bind this space to new piece
    }
};
Space.prototype.setNeighbors = function(ur, ul, ll, lr) {
        this.neighbors.splice(0, this.neighbors.length, ur, ul, ll, lr);
};

/* Space togglers */
Space.prototype.toggleOccupiedOwn = function() {
    this.available = this.occupiedOwn;
    this.occupiedOwn = !this.occupiedOwn;
};
Space.prototype.toggleOccupiedOpp = function() {
    this.available = this.occupiedOpp;
    this.occupiedOpp = !this.occupiedOpp;
};

/*
* validSpace checks if a given position is on a 8x8 checkerboard
* Parameter row: integer horizontal position
* Parameter col: integer vertical position
* Returns: boolean. true if position is a valid space, else false
*/
function validSpace(row, board_col) {
    if(row < 0 || row >= ver || board_col < 0 || board_col >= hor) {
        return false;
    } else return true;
}

/*
* getNeighbor checks an element in the board array at given row and column
* Parameter row: integer horizontal position on board
* Parameter col: integer vertical position on board
* Parameter board: Space array of the checkerboard
* Returns:
* If the row and col designate a position off the board, return null
* If the element already contains a Space object, return a reference to that object
* If the element is still empty, create and return a new Space object
*/
function getNeighbor(row, col, board) {
    var board_col = Math.floor(col/2);
    if (!validSpace(row, board_col)) {
        return null;
    } else if (board[row][board_col] instanceof Space) {
        return board[row][board_col];
    } else return new Space(row, col, board);
}
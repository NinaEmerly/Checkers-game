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
    board[row][board_col] = this;                       // Register this Space on board
    this.row = row;                                     // integer horizontal position on board
    this.col = board_col;                               // integer vertical position on board
    this.occupiedOwn = false;                           // boolean, space is occupied by own piece
    this.occupiedOpp = false;                           // boolean, space is occupied by opponent's piece
    this.available = true;                              // boolean, space is unoccupied
    
    var ur_row = row + 1;
    var ur_col = col + 1;
    var ll_row = row - 1;
    var ll_col = col - 1;
    var ur_Space = getNeighbor(ur_row, ur_col, board);
    var ul_Space = getNeighbor(ur_row, ll_col, board);
    var ll_Space = getNeighbor(ll_row, ll_col, board);
    var lr_Space = getNeighbor(ll_row, ur_col, board);
    var temp = [ur_Space, ul_Space, ll_Space, lr_Space];
    this.neighbors = temp.filter(notNull);              // array of references to adjacent spaces [ur, ul, ll, lr]
}

/* Used as a filter to remove null elements from neighbors */
function notNull(elem) { return elem !== null; }

/* Space getters */
Space.prototype.getRow = function() { return this.row; };
Space.prototype.getCol = function() { return this.col; };
Space.prototype.getNeighbors = function() { return this.neighbors; };
Space.prototype.getOccupiedOwn = function() { return this.occupiedOwn; };
Space.prototype.getOccupiedOpp = function() { return this.occupiedOpp; };
Space.prototype.getAvailable = function() { return this.available; };

/* Space setters */
Space.prototype.setRow = function(row) { this.row = row; };
Space.prototype.setCol = function(col) { this.col = col; };
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

/* Description: validMoves returns valid destinations provided with an origin 'pos'
candidate destinations are checked whether they are on the board and whether they are available
Parameter pos: an array of two integer elements: [row, column] 
Returns: An array of valid destinations */
Space.prototype.validMoves = function() {
    //TODO
}

/*
* validSpace checks if a given position is on a 8x8 checkerboard
* Parameter row: integer horizontal position
* Parameter col: integer vertical position
* Returns: boolean. true if position is a valid space, else false
*/
function validSpace(row, board_col) {
    if(row < 0 || row >= hor || board_col < 0 || board_col >= ver) {
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
    console.log(row, col)
    var board_col = Math.floor(col/2);
    if (!validSpace(row, board_col)) {
        return null;
    } else if (board[row][board_col] instanceof Space) {
        return board[row][board_col];
    } else return new Space(row, col, board);
}
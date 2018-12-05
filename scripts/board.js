var main = function() {
    "use strict";

    // Global variables
    var hor = 8;    // Number of rows
    var ver = 4;    // Number of columns/2 (this initializes a 8x8 board)

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
        board[row][board_col] = this;       // Register this Space on board
        this.row = row;                     // integer horizontal position on board
        this.col = board_col;               // integer vertical position on board
        this.occupiedOwn = false;           // boolean, space is occupied by own piece
        this.occupiedOpp = false;           // boolean, space is occupied by opponent's piece
        this.available = true;              // boolean, space is unoccupied
        
        var ur_row = row + 1;
        var ur_col = col + 1;
        var ll_row = row - 1;
        var ll_col = col - 1;
        var ur_Space = getNeighbor(ur_row, ur_col, board);
        var ul_Space = getNeighbor(ur_row, ll_col, board);
        var ll_Space = getNeighbor(ll_row, ll_col, board);
        var lr_Space = getNeighbor(ll_row, ur_col, board);
        this.neighbors = new Array(ur_Space, ul_Space, ll_Space, lr_Space);      // array of references to adjacent spaces [ur, ul, ll, lr]
    }

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

    /* Construct the initial checkerboard */
    function Game() {
        // Initialize an empty board hor x ver (8x4)
        this.board = new Array(0);
        for (var i=0; i<hor; i++) {
            this.board.push(new Array(ver));
        }

        // Generate Space objects and populate the board with them
        new Space(0, 0, this.board);
    };

    //TODO: rewrite validMoves to work with Space objects

    /* Description: validMoves returns valid destinations provided with an origin 'pos'
    candidate destinations are checked whether they are on the board and whether they are available
    Parameter pos: an array of two integer elements: [row, column] 
    Returns: An array of valid destinations */
    Game.prototype.validMoves = function(pos) {
        // Initialize local variables
        var p_row, p_col, d_row, d_col, destinations, i;
        p_row = pos[0];
        p_col = pos[1];
        destinations = [
            [p_row-1, p_col+1],
            [p_row-1, p_col-1],
            [p_row+1, p_col-1],
            [p_row+1, p_col+1]
        ];

        // Check if destinations are on board
        for (i=0; i<destinations.length; i++) {
            if (destinations[i][0] === -1 || destinations[i][0] === 8) {
                console.log("Removed (row number not on board):");
                console.log(destinations.splice(i));
            }
            else if (destinations[i][1] === -1 || destinations[i][1] === 4) {
                console.log("Removed (column number not on board):");
                console.log(destinations.splice(i));
            }
        }

        // Check if remaining destinations are available
        for (i=0; i<destinations.length; i++) {
            d_row = destinations[i][0];
            d_col = destinations[i][1];
            
            // Case 1: destination is occupied by own piece
            if (this.board[d_row][d_col] === true) {
                console.log("Removed (occupied by own piece):");
                console.log(destinations.splice(i));
            }
            // Case 2: destination is occupied by opponent's piece
            else if (this.board[d_row][d_col] === false) {
                console.log("Removed (occupied by opponent's piece):");
                console.log(destinations.splice(i));
                // Check if the conjuncting space is available (can you take this piece?)
                if (this.board[2*d_row-p_row][2*d_col-p_col] === null) {
                    destinations.push([2*d_row-p_row, 2*d_col-p_col]);
                }
            // Case 3: destination is available: do nothing
            }
        }
        return destinations;
    };

    // Test
    var g1 = new Game();
    var dests = g1.validMoves([2,0]);
    for (var i=0; i<dests.length; i++) {
        console.log("Valid destinations:\n" + i + ": " + dests[i][0] + "-" + dests[i][1]);
    }
};

$(document).ready(main);
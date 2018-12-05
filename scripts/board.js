var main = function() {
    "use strict";

    function Space(row, col, occupiedOwn, occupiedOpp) {
        this.row = row;
        this.col = col;
        this.occupiedOwn = occupiedOwn;
        this.occupiedOpp = occupiedOpp;
        if (occupiedOwn === false && occupiedOpp === false) {
            this.available = true;
        } else this.available = false;
    }

    /* Space getters */
    Space.prototype.getRow = function() { return this.row; };
    Space.prototype.getCol = function() { return this.col; };
    Space.prototype.getOccupiedOwn = function() { return this.occupiedOwn; };
    Space.prototype.getOccupiedOpp = function() { return this.occupiedOpp; };
    Space.prototype.getAvailable = function() { return this.available; };

    /* Space setters */
    Space.prototype.setRow = function(row) { this.row = row; };
    Space.prototype.setCol = function(col) { this.col = col; };

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
        // Initialize an empty board 8x4
        this.board = new Array(0);
        for (var i=0; i<8; i++) {
            this.board.push(new Array(4));
        }
        // Populate board with spaces and pieces
        // Rows 0-2: own pieces
        for (var row=0; row<3; row++) {
            for (var col=0; col<4; col++) {
                this.board[row][col] = new Space(row, col, true, false);
            }
        }
        // Rows 3-4: unoccupied
        for (row; row<5; row++) {
            for (col=0; col<4; col++) {
                this.board[row][col] = new Space(row, col, false, false);
            }
        }
        // Rows 5-7: opponent's pieces
        for (row; row<8; row++) {
            for (col=0; col<4; col++) {
                this.board[row][col] = new Space(row, col, false, true);
            }
        }
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
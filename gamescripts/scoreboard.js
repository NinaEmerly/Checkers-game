/*
*   Constructs a Score object which keeps track of the score
*/
var Scoreboard = ( function(A, B) {
    // Private members
    var scoreA = A;     // scoreA keeps count of the amount of pieces player A has taken
    var scoreB = B;     // scoreB keeps count of the amount of pieces player B has taken
    
    // Public members
    return {
        /* Getters */
        getScore    : function() { return {"A" : scoreA, "B" : scoreB}; },
        getScoreA   : function() { return scoreA; },
        getScoreB   : function() { return scoreB; },
        
        /* Incrementers */
        incrScoreA  : function() { scoreA++; },
        incrScoreB  : function() { scoreB++; }
    }
})(0, 0);

module.exports = Scoreboard;
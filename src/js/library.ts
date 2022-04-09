// https://en.wikipedia.org/wiki/Conway's_Game_of_Life#Examples_of_patterns 
/** Oscillator - Blinker  */
/*liveCells.set('0,0', true);
liveCells.set('1,0', true);
liveCells.set('2,0', true);
*/ 

/** Oscillator - Toad */
/*liveCells.set('1,0', true);
liveCells.set('2,0', true);
liveCells.set('3,0', true); 
liveCells.set('0,1', true);
liveCells.set('1,1', true);
liveCells.set('2,1', true);
*/

/** Oscillator - Beacon */
/* 
liveCells.set('0,0', true);
liveCells.set('0,1', true);
liveCells.set('1,0', true);
liveCells.set('1,1', true);
liveCells.set('2,2', true);
liveCells.set('2,3', true);
liveCells.set('3,2', true);
liveCells.set('3,3', true);
*/

/** Oscillator - Pulsar (period: 3) */
/*
deserializeFromJSON(
    '{"liveCells":[{"x":-6,"y":-7},{"x":-5,"y":-7},{"x":-4,"y":-7},{"x":-3,"y":-5},{"x":-3,"y":-4},{"x":-3,"y":-3},'
    + '{"x":-4,"y":-2},{"x":-5,"y":-2},{"x":-6,"y":-2},{"x":-8,"y":-3},{"x":-8,"y":-4},{"x":-8,"y":-5},{"x":-1,"y":-5},'
    + '{"x":-1,"y":-4},{"x":-1,"y":-3},{"x":0,"y":-2},{"x":1,"y":-2},{"x":2,"y":-2},{"x":4,"y":-3},{"x":4,"y":-4},'
    + '{"x":4,"y":-5},{"x":2,"y":-7},{"x":1,"y":-7},{"x":0,"y":-7},{"x":-6,"y":0},{"x":-5,"y":0},{"x":-4,"y":0},{"x":0,"y":0},'
    + '{"x":1,"y":0},{"x":2,"y":0},{"x":-3,"y":1},{"x":-3,"y":2},{"x":-3,"y":3},{"x":-1,"y":1},{"x":-1,"y":2},{"x":-1,"y":3},'
    + '{"x":0,"y":5},{"x":1,"y":5},{"x":2,"y":5},{"x":-4,"y":5},{"x":-5,"y":5},{"x":-6,"y":5},{"x":4,"y":3},{"x":4,"y":2},'
    + '{"x":4,"y":1},{"x":-8,"y":1},{"x":-8,"y":2},{"x":-8,"y":3}]}', 
    ecosystem.livingCells); 
*/

/** Oscillator - Penta-decathlon */
// V0
/*
hydrateSituationFromJSON(
    '{"liveCells":[[-1,-8],[-1,-7],[-2,-6],[-1,-6],[0,-6],[-2,-3],[-1,-3],[0,-3],[-1,-2],'
        + '[-1,-1],[-1,0],[-1,1],[-2,2],[-1,2],[0,2],[-2,5],[-1,5],[0,5],[-1,6],[-1,7]]}', 
    liveCells); 
*/

// V1 
/* 
deserializeFromJSON(
    '{"liveCells":[{"x":-9,"y":-8},{"x":-9,"y":-7},{"x":-10,"y":-6},{"x":-8,"y":-6},{"x":-9,"y":-5},{"x":-9,"y":-4},{"x":-9,"y":-2},'
    + '{"x":-9,"y":-3},{"x":-10,"y":-1},{"x":-8,"y":-1},{"x":-9,"y":0},{"x":-9,"y":1}]}', 
    ecosystem.livingCells); 
*/


/** Spaceship - Glider */
/* hydrateSituationFromJSON(
    '{"liveCells":[[-13,-14],[-12,-13],[-12,-12],[-13,-12],[-14,-12]]}', 
    liveCells); 
*/

// V1 
/** Issue with labelling algo */
/* liveCells.hydrateSituationFromJSON(
    '{"liveCells":[{"x":-5,"y":-2,"groupID":-1},{"x":-5,"y":-1,"groupID":-1},{"x":-5,"y":1,"groupID":-1},' 
        + '{"x":-5,"y":0,"groupID":-1},{"x":-5,"y":2,"groupID":-1},{"x":-5,"y":3,"groupID":-1},{"x":-6,"y":-1,"groupID":-1},'
        + '{"x":-6,"y":0,"groupID":-1},{"x":-6,"y":1,"groupID":-1},{"x":-6,"y":2,"groupID":-1}]}'); 
*/
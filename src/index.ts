// JS 
// import $ from 'jquery'; // No need of JQuery here! 
import 'bootstrap';  

import { ListOfCells } from './js/cellUtils';
import { applyLifeRules } from './js/cellRules';  
import { addGridListeners, addGridButtonListeners, updateUI, GridUIComponents, GameStatus } from './js/gridUI';

// CSS 
import './css/main.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

function lifeRound(pLiveCells:ListOfCells, pDeadCells: ListOfCells): void {
    applyLifeRules(pLiveCells, pDeadCells); 
    updateUI(pLiveCells, pDeadCells); 
}

// Initialization 
let liveCells:ListOfCells = new Map();
let deadCells: ListOfCells = new Map();

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


let UIComponents: GridUIComponents = { status: GameStatus.PAUSED }; 

/** HERE WE GO! */
updateUI(liveCells, deadCells); 

addGridListeners(liveCells, document);
addGridButtonListeners(liveCells, deadCells, lifeRound, UIComponents);  


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
let liveCells:ListOfCells = new ListOfCells();
let deadCells: ListOfCells = new ListOfCells();

let UIComponents: GridUIComponents = { status: GameStatus.PAUSED }; 

/** HERE WE GO! */
updateUI(liveCells, deadCells); 

addGridListeners(liveCells, document);
addGridButtonListeners(liveCells, deadCells, lifeRound, UIComponents);  


// JS 
// import $ from 'jquery'; // No need of JQuery here! 
import 'bootstrap';  

import { ListOfCells, hydrateSituationFromJSON } from './js/cellUtils';
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

let UIComponents: GridUIComponents = { status: GameStatus.PAUSED }; 

/** HERE WE GO! */
updateUI(liveCells, deadCells); 

addGridListeners(liveCells, document);
addGridButtonListeners(liveCells, deadCells, lifeRound, UIComponents);  


// JS 
// import $ from 'jquery'; // No need of JQuery here! 
import 'bootstrap';  

import { ListOfCells } from './js/cellUtils';
import { applyLifeRules } from './js/cellRules';  
import { addGridListeners, addGridButtonListeners, updateUI, GridUIComponents, GameStatus, displayCycles } from './js/gridUI';
import { SituationMemory } from './js/cycles';

// CSS 
import './css/main.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

function lifeRound(pLiveCells:ListOfCells, pDeadCells: ListOfCells): void {
    applyLifeRules(pLiveCells, pDeadCells); 
    updateUI(pLiveCells); 
}

function cycleDetection(pLiveCells: ListOfCells, pSituationHistory: SituationMemory): void {
    pSituationHistory.addSituation(pLiveCells);
    pSituationHistory.searchForCycles(); 
    displayCycles(pSituationHistory); 
}

//TODO: have a proper object 
// Initialization 
let liveCells: ListOfCells = new ListOfCells();
let deadCells: ListOfCells = new ListOfCells();
let situationHistory: SituationMemory = new SituationMemory(); 

let UIComponents: GridUIComponents = { status: GameStatus.PAUSED }; 

/** HERE WE GO! */
updateUI(liveCells); 

addGridListeners(liveCells, document);
addGridButtonListeners(liveCells, deadCells, situationHistory, 
    lifeRound, cycleDetection, 
    /* Initial labelling=*/ (l: ListOfCells) => { l.clearAndLabelGroups() }, 
    UIComponents);  


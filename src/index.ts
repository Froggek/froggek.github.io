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

function lifeRound(pLiveCells:ListOfCells): void {
    applyLifeRules(pLiveCells); 
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
let situationHistory: SituationMemory = new SituationMemory(); 

let UIComponents: GridUIComponents = { status: GameStatus.PAUSED }; 

// TODO: shouldn't be there... 
/* liveCells.hydrateSituationFromJSON('{"liveCells":[{"x":-4,"y":-9,"groupID":0},{"x":-3,"y":-9,"groupID":0},{"x":-2,"y":-9,"groupID":0},' + 
    '{"x":-3,"y":-10,"groupID":0},{"x":-4,"y":-6,"groupID":1},{"x":-3,"y":-6,"groupID":1},{"x":-2,"y":-6,"groupID":1},{"x":-4,"y":-3,"groupID":2},' + 
    '{"x":-4,"y":-4,"groupID":2},{"x":-2,"y":-4,"groupID":3},{"x":-2,"y":-3,"groupID":3},{"x":-4,"y":-1,"groupID":4},{"x":-3,"y":-1,"groupID":4},' + 
    '{"x":-2,"y":-1,"groupID":4},{"x":-4,"y":2,"groupID":5},{"x":-3,"y":2,"groupID":5},{"x":-2,"y":2,"groupID":5},{"x":-3,"y":3,"groupID":5}]}'); 
*/
liveCells.hydrateSituationFromJSON(
    '{"liveCells":[{"x":-5,"y":-2,"groupID":-1},{"x":-5,"y":-1,"groupID":-1},{"x":-5,"y":1,"groupID":-1},' 
        + '{"x":-5,"y":0,"groupID":-1},{"x":-5,"y":2,"groupID":-1},{"x":-5,"y":3,"groupID":-1},{"x":-6,"y":-1,"groupID":-1},'
        + '{"x":-6,"y":0,"groupID":-1},{"x":-6,"y":1,"groupID":-1},{"x":-6,"y":2,"groupID":-1}]}'); 

/** HERE WE GO! */
updateUI(liveCells); 

addGridListeners(liveCells, document);
addGridButtonListeners(liveCells, situationHistory, 
    lifeRound, cycleDetection, 
    /* Initial labelling=*/ (l: ListOfCells) => { l.clearAndLabelGroups() }, 
    UIComponents);  


// JS 
// import $ from 'jquery'; // No need of JQuery here! 
import 'bootstrap';  

import { ListOfCells } from './js/ListOfCells';
import { applyLifeRules } from './js/cellRules';  
import { addGridListeners, addGridButtonListeners, updateUI, GridUIComponents, GameStatus, displayCycles } from './js/gridUI';
import { Ecosystem } from './js/Philogenesis';

// CSS 
import './css/main.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

function lifeRound(pLiveCells:ListOfCells): void {
    applyLifeRules(pLiveCells); 
    updateUI(pLiveCells); 
}

function cycleDetection(pEcosystem: Ecosystem): void {
    pEcosystem.recordNewGeneration(); 
    pEcosystem.udpateCycles(); 
    displayCycles(pEcosystem); 
}

// Initialization 
let ecosystem: Ecosystem = new Ecosystem(); 
let UIComponents: GridUIComponents = { status: GameStatus.PAUSED }; 

// TODO: shouldn't be there... 
/*liveCells.hydrateSituationFromJSON('{"liveCells":[{"x":-4,"y":-9,"groupID":0},{"x":-3,"y":-9,"groupID":0},{"x":-2,"y":-9,"groupID":0},' + 
    '{"x":-3,"y":-10,"groupID":0},{"x":-4,"y":-6,"groupID":1},{"x":-3,"y":-6,"groupID":1},{"x":-2,"y":-6,"groupID":1},{"x":-4,"y":-3,"groupID":2},' + 
    '{"x":-4,"y":-4,"groupID":2},{"x":-2,"y":-4,"groupID":3},{"x":-2,"y":-3,"groupID":3},{"x":-4,"y":-1,"groupID":4},{"x":-3,"y":-1,"groupID":4},' + 
    '{"x":-2,"y":-1,"groupID":4},{"x":-4,"y":2,"groupID":5},{"x":-3,"y":2,"groupID":5},{"x":-2,"y":2,"groupID":5},{"x":-3,"y":3,"groupID":5}]}'); 
*/
/*liveCells.hydrateSituationFromJSON(
    '{"liveCells":[{"x":-5,"y":-2,"groupID":-1},{"x":-5,"y":-1,"groupID":-1},{"x":-5,"y":1,"groupID":-1},' 
        + '{"x":-5,"y":0,"groupID":-1},{"x":-5,"y":2,"groupID":-1},{"x":-5,"y":3,"groupID":-1},{"x":-6,"y":-1,"groupID":-1},'
        + '{"x":-6,"y":0,"groupID":-1},{"x":-6,"y":1,"groupID":-1},{"x":-6,"y":2,"groupID":-1}]}'); 
*/

// Glider 
/*liveCells.hydrateSituationFromJSON(
    '{"liveCells":[{"x":-12,"y":-14,"groupID":-1},{"x":-12,"y":-13,"groupID":-1},'
        + '{"x":-12,"y":-12,"groupID":-1},{"x":-13,"y":-12,"groupID":-1},{"x":-14,"y":-13,"groupID":-1}]}'); 
*/

/** HERE WE GO! */
updateUI(ecosystem.livingCells); 

addGridListeners(ecosystem.livingCells, document);
addGridButtonListeners(ecosystem, UIComponents, 
    lifeRound, cycleDetection, 
    /* Initial labelling=*/ (l: ListOfCells) => { l.clearAndLabelGroups() } 
    );  


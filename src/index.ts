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
import { deserializeFromJSON } from './js/cellJSONFormats';

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
// ???
/* deserializeFromJSON('{"liveCells":[{"x":-12,"y":-1},{"x":-11,"y":-1},{"x":-10,"y":-1},' +
    '{"x":-12,"y":1},{"x":-11,"y":1},{"x":-10,"y":1},{"x":-12,"y":-3},{"x":-11,"y":-3},' +
    '{"x":-10,"y":-3},{"x":-11,"y":-2},{"x":-11,"y":0}]}', 
    ecosystem.livingCells);*/

// Pulsar (T = 3)
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

// Pentadecathlon (T = 15) 
    deserializeFromJSON(
        '{"liveCells":[{"x":-9,"y":-8},{"x":-9,"y":-7},{"x":-10,"y":-6},{"x":-8,"y":-6},{"x":-9,"y":-5},{"x":-9,"y":-4},{"x":-9,"y":-2},'
        + '{"x":-9,"y":-3},{"x":-10,"y":-1},{"x":-8,"y":-1},{"x":-9,"y":0},{"x":-9,"y":1}]}', 
        ecosystem.livingCells); 

/** HERE WE GO! */
updateUI(ecosystem.livingCells); 

addGridListeners(ecosystem.livingCells, document);
addGridButtonListeners(ecosystem, UIComponents, 
    lifeRound, cycleDetection, 
    /* Initial labelling=*/ (l: ListOfCells) => { l.clearAndLabelGroups() } 
    );  


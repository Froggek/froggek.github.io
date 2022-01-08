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
deserializeFromJSON('{"liveCells":[{"x":-12,"y":-1},{"x":-11,"y":-1},{"x":-10,"y":-1},' +
    '{"x":-12,"y":1},{"x":-11,"y":1},{"x":-10,"y":1},{"x":-12,"y":-3},{"x":-11,"y":-3},' +
    '{"x":-10,"y":-3},{"x":-11,"y":-2},{"x":-11,"y":0}]}', 
    ecosystem.livingCells);

/** HERE WE GO! */
updateUI(ecosystem.livingCells); 

addGridListeners(ecosystem.livingCells, document);
addGridButtonListeners(ecosystem, UIComponents, 
    lifeRound, cycleDetection, 
    /* Initial labelling=*/ (l: ListOfCells) => { l.clearAndLabelGroups() } 
    );  


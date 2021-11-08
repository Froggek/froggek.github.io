import $ from "jquery"; 
import bootstrap from 'bootstrap'; 

type CellCoordinates = string; 
type ListOfCells = Map<CellCoordinates, boolean>; // "x,y" => isAlive?

function getIntCoordinates(coordinates: CellCoordinates): {x:number, y:number} {
    let splitStringCoords = coordinates.split(',');
    
    if (splitStringCoords.length != 2)
        throw "\"" + coordinates + "\" cannot be converted into Integer coordinates"; 

    return {x: parseInt(splitStringCoords[0]), 
            y: parseInt(splitStringCoords[1])};  
}

function getCoordinatesFromInt(x:number, y:number): CellCoordinates {
    return x + ',' + y; 
} 

function getNeighborCoordinates(coords: CellCoordinates): Array<CellCoordinates> {
    let result: Array<CellCoordinates> = new Array() ;

    const cellIntCoords = getIntCoordinates(coords); 

    for (let x:number = -1; x <= 1; x++) {
        for (let y:number = -1; y <= 1; y++ ) {
            // The cell itself isn't a neighbor 
            if (! ((x === 0) && (y === 0)))
                result.push((cellIntCoords.x + x) + ',' + (cellIntCoords.y + y)); 
        }
    }

    return result; 
}

function getNbOfLivingNeighbors(coords: CellCoordinates, livingCells: ListOfCells): number {
    const neighborCoords:CellCoordinates[] = getNeighborCoordinates(coords);

    return neighborCoords
            .filter((neighbor: CellCoordinates) => { return livingCells.has(neighbor) })
            .length; 
}

function getDeadNeighbors(coords: CellCoordinates, livingCells: ListOfCells): CellCoordinates[] {
    const neighborCoords:CellCoordinates[] = getNeighborCoordinates(coords);
    
    return neighborCoords.filter((neighbor: CellCoordinates) => { return ! livingCells.has(neighbor) }); 
}

/**  Applying rules 
 * 1-Any live cell with two or three live neighbours survives.
 * 2-Any dead cell with three live neighbours becomes a live cell.
 * 3-All other live cells die in the next generation. 
 *      Similarly, all other dead cells stay dead. 
*/
function applyLifeRules(pLiveCells: ListOfCells, pDeadCells: ListOfCells): void {
    // Processing live cells
    pLiveCells.forEach((v, k) => {
        const deadNeighbors: CellCoordinates[] = getDeadNeighbors(k, pLiveCells); 
        
        // Live cells in under/overpopulation die 
        const nbOfLivingNeighbors: number = 8 - deadNeighbors.length; 
        if ((nbOfLivingNeighbors < 2) || (nbOfLivingNeighbors > 3))
            pLiveCells.set(k, false); 

        // Dead neighbors need to be processed ... later on
        deadNeighbors.forEach(
            (deadCellCoords: CellCoordinates) => { pDeadCells.set(deadCellCoords, false) });
    }); 

    // Processing dead cells
    pDeadCells.forEach((v, k) => {
        if (getNbOfLivingNeighbors(k, pLiveCells) === 3)
            pDeadCells.set(k, true); 
    }); 

    // Moving and cleansing 
    pDeadCells.forEach((v, k) => {
        if (v)
            pLiveCells.set(k, true); 
    }); 

    pDeadCells.clear(); // = new Map(); 

    for (const [k, v] of pLiveCells) {
        if (! v)
            pLiveCells.delete(k); 
    }
}

function updateUI(pLiveCells: ListOfCells, pDeadCells: ListOfCells): void {
    let tableBody: JQuery<HTMLElement> = $('#game-grid-body'); 

    const NB_ROWS:number = 30; 
    const SHIFT_Y: number = Math.floor(NB_ROWS / 2); 
    const NB_COLUMNS:number = 30; 
    const SHIFT_X:number = Math.floor(NB_COLUMNS / 2); 

    tableBody.html(''); 

    for (let i:number = 0; i < NB_ROWS; i++) {
        let tr: string = '<tr>';

        for (let j:number = 0; j < NB_COLUMNS; j++) {
            tr += '<td ' 
                + (pLiveCells.has(getCoordinatesFromInt(j - SHIFT_X, i - SHIFT_Y)) 
                    ? 'class="dead-cell"' : '') 
                + ' ></td>'; 
        }
        tableBody.append(tr + '</tr>'); 
    }


    let debug: string = ''; 
    pLiveCells.forEach((v, k) => {
        debug += k + ': ' + v + '<br/>'; 
    }); 

    debug += '=====================<br/>';

    pDeadCells.forEach((v, k) => {
        debug += k + ': ' + v + '<br/>'; 
    }); 

    // $('#debug').html(debug); 
}

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
/* */
liveCells.set('0,0', true);
liveCells.set('0,1', true);
liveCells.set('1,0', true);
liveCells.set('1,1', true);
liveCells.set('2,2', true);
liveCells.set('2,3', true);
liveCells.set('3,2', true);
liveCells.set('3,3', true);



updateUI(liveCells, deadCells); 

let repeat = setInterval(() => { lifeRound(liveCells, deadCells) }, 1000); 




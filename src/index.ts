import $ from "jquery"; 
import { execPath } from "process";
import { getEnvironmentData } from "worker_threads";

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

// Initialization 
let liveCells:ListOfCells = new Map();
let deadCells: ListOfCells = new Map(); 
liveCells.set('0,0', true);
liveCells.set('1,0', true);
liveCells.set('2,0', true);



/**  Applying rules 
 * 1-Any live cell with two or three live neighbours survives.
 * 2-Any dead cell with three live neighbours becomes a live cell.
 * 3-All other live cells die in the next generation. 
 *      Similarly, all other dead cells stay dead. 
*/
// Processing live cells
liveCells.forEach((v, k) => {
    const deadNeighbors: CellCoordinates[] = getDeadNeighbors(k, liveCells); 
    
    // Live cells in under/overpopulation die 
    const nbOfLivingNeighbors: number = 8 - deadNeighbors.length; 
    if ((nbOfLivingNeighbors < 2) || (nbOfLivingNeighbors > 3))
        liveCells.set(k, false); 

    // Dead neighbors need to be processed ... later on
    deadNeighbors.forEach((deadCellCoords: CellCoordinates) => { deadCells.set(deadCellCoords, false) });
}); 

// Processing dead cells
deadCells.forEach((v, k) => {
    if (getNbOfLivingNeighbors(k, liveCells) === 3)
        deadCells.set(k, true); 
}); 

// Moving and cleansing 
deadCells.forEach((v, k) => {
    if (v)
        liveCells.set(k, true); 
}); 

deadCells = new Map(); 

for (const [k, v] of liveCells) {
    if (! v)
        liveCells.delete(k); 
}

// Drawing 
let tableBody: JQuery<HTMLElement> = $('#game-grid-body'); 

for (let i:number = 0; i < 30; i++) {
    let tr: string = '<tr>';

    for (let j:number = 0; j < 30; j++) {
        tr += '<td></td>'; 
    }

    tableBody.append(tr + '</tr>'); 
}


let debug: string = ''; 
liveCells.forEach((v, k) => {
    debug += k + ': ' + v + '<br/>'; 
}); 

debug += '=====================<br/>';

deadCells.forEach((v, k) => {
    debug += k + ': ' + v + '<br/>'; 
}); 

$('#debug').html(debug); 



import { CellCoordinates, ListOfCells, getIntCoordinates } from './cellUtils'; 

// TODO: to be removed 
import { serializeSituation2JSON } from './cellUtils'; 
import $ from 'jquery'; 

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
export function applyLifeRules(pLiveCells: ListOfCells, pDeadCells: ListOfCells): void {
    // Processing live cells
    $("#debug").append(serializeSituation2JSON(pLiveCells) + '<br/>');
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

    $("#debug").append(serializeSituation2JSON(pLiveCells) + '<br/>');

    // Processing dead cells
    pDeadCells.forEach((v, k) => {
        if (getNbOfLivingNeighbors(k, pLiveCells) === 3)
            pDeadCells.set(k, true); 
    }); 

    $("#debug").append(serializeSituation2JSON(pLiveCells) + '<br/>');
    
    // Moving and cleansing 
    pDeadCells.forEach((v, k) => {
        if (v)
            pLiveCells.set(k, true); 
    }); 

    $("#debug").append(serializeSituation2JSON(pLiveCells) + '<br/>');

    pDeadCells.clear(); // = new Map(); 

    $("#debug").append(serializeSituation2JSON(pLiveCells) + '<br/>');

    for (const [k, v] of pLiveCells) {
        if (! v)
            pLiveCells.delete(k); 
    }

    $("#debug").append(serializeSituation2JSON(pLiveCells) + '<br/><br/>');
}
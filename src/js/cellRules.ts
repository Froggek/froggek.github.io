import { CellCoordinates, ListOfCells } from './cellUtils'; 

function getNeighborCoordinates(coords: CellCoordinates): Array<CellCoordinates> {
    let result: Array<CellCoordinates> = new Array() ;

    const cellIntCoords = ListOfCells.getIntCoordinates(coords); 

    for (let x:number = -1; x <= 1; x++) {
        for (let y:number = -1; y <= 1; y++ ) {
            // The cell itself isn't a neighbor 
            if (! ((x === 0) && (y === 0)))
                result.push((cellIntCoords.x + x) + ',' + (cellIntCoords.y + y)); 
        }
    }

    return result; 
}

function getLivingNeighborCoords(coords: CellCoordinates, livingCells: ListOfCells): CellCoordinates[] {
    const neighborCoords:CellCoordinates[] = getNeighborCoordinates(coords);

    return neighborCoords
            .filter((neighbor: CellCoordinates) => { return livingCells.has(neighbor) }); 
}

function getDeadNeighborCoords(coords: CellCoordinates, livingCells: ListOfCells): CellCoordinates[] {
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
    pLiveCells.processCells((_, k) => {
        const deadNeighbors: CellCoordinates[] = getDeadNeighborCoords(k, pLiveCells); 
        
        // Live cells in under/overpopulation die 
        const nbOfLivingNeighbors: number = 8 - deadNeighbors.length; 
        if ((nbOfLivingNeighbors < 2) || (nbOfLivingNeighbors > 3))
            pLiveCells.set(k, false); 

        // Dead neighbors need to be processed ... later on
        deadNeighbors.forEach(
            (deadCellCoords: CellCoordinates) => { pDeadCells.set(deadCellCoords, false) });
    }); 

    // Dead cell with 3 neighbors revive 
    pDeadCells.processCells((_, k) => {
        let livingNeighbors: CellCoordinates[] = getLivingNeighborCoords(k, pLiveCells);
        
        if (livingNeighbors.length === 3) {
            pDeadCells.set(k, 
                true, // cell resurrects 
                -1 );  // group ID 
            
        }
    }); 
    
    // Moving and cleansing 
    pDeadCells.processCells((v, k) => {
        if (v.isAlive())
            pLiveCells.set(k, true); 
    }); 

    pDeadCells.clear(); // = new Map(); 

    pLiveCells.removeCells(false); 
}
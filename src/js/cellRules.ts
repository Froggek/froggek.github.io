import { CellCoordinates, ListOfCells } from './cellUtils'; 

/**  Applying rules 
 * 1-Any live cell with two or three live neighbours survives.
 * 2-Any dead cell with three live neighbours becomes a live cell.
 * 3-All other live cells die in the next generation. 
 *      Similarly, all other dead cells stay dead. 
*/
export function applyLifeRules(pLiveCells: ListOfCells, pDeadCells: ListOfCells): void {
    // Processing live cells
    pLiveCells.processCells((_, k) => {
        const deadNeighbors: CellCoordinates[] = pLiveCells.getDeadNeighborCoords(k); 
        
        // Live cells in under/overpopulation die 
        const nbOfLivingNeighbors: number = 8 - deadNeighbors.length; 
        if ((nbOfLivingNeighbors < 2) || (nbOfLivingNeighbors > 3))
            pLiveCells.set(k, false); 

        // Dead neighbors need to be processed ... later on
        deadNeighbors.forEach(
            (deadCellCoords: CellCoordinates) => { pDeadCells.set(deadCellCoords, false) });
    }); 

    // Dead cell with 3 neighbors revive 
    pDeadCells.processCells((_, pDeadCellCoords: CellCoordinates) => {
        let livingNeighbors: CellCoordinates[] = pLiveCells.getLivingNeighborCoords(pDeadCellCoords);
        
        if (livingNeighbors.length === 3)
            pDeadCells.set(pDeadCellCoords, /* cell resurrects */ true );        
    }); 
    
    // Moving and cleansing 
    pDeadCells.processCells((v, pDeadCellCoords) => {
        if (v.isAlive()) {
            pLiveCells.set(pDeadCellCoords, true); 
            // Labelling this newly-born cell 
            pLiveCells.labelCell(pDeadCellCoords);   
        }
    }); 

    pDeadCells.clear(); // = new Map(); 

    pLiveCells.removeCells(false); 
}
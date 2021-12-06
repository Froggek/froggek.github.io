import { CellCoordinates, ListOfCells } from './cellUtils'; 

/**  Applying rules 
 * 1-Any live cell with two or three live neighbours survives.
 * 2-Any dead cell with three live neighbours becomes a live cell.
 *  [Here, the cells get (re)labelled]
 * 3-All other live cells die in the next generation. 
 *      Similarly, all other dead cells stay dead. 
*/
export function applyLifeRules(pLiveCells: ListOfCells): void {
    let wDeadCells: ListOfCells = new ListOfCells(); 
    
    // Processing live cells
    pLiveCells.processCells((_, k) => {
        const deadNeighbors: CellCoordinates[] = pLiveCells.getDeadNeighborCoords(k); 
        
        // Live cells in under/overpopulation die 
        const kNbOfLivingNeighbors: number = 8 - deadNeighbors.length; 
        if ((kNbOfLivingNeighbors < 2) || (kNbOfLivingNeighbors > 3))
            pLiveCells.set(k, false); 

        // Dead neighbors need to be processed ... later on
        deadNeighbors.forEach(
            (deadCellCoords: CellCoordinates) => { wDeadCells.set(deadCellCoords, false) });
    }); 

    // RESURRECTIONS
    // Dead cell with 3 neighbors revive 
    wDeadCells.processCells((_, pDeadCellCoords: CellCoordinates) => {
        let livingNeighbors: CellCoordinates[] = pLiveCells.getLivingNeighborCoords(pDeadCellCoords);
        
        if (livingNeighbors.length === 3)
            wDeadCells.set(pDeadCellCoords, /* cell resurrects */ true );        
    }); 
    
    // We ONLY label resurrecting cells 
    // (this will automatically re-label their neighbors, if need be) 
    wDeadCells.processCells((v, pDeadCellCoords) => {
        if (v.isAlive()) {
            pLiveCells.set(pDeadCellCoords, true); 
            // Labelling this newly-born cell 
            pLiveCells.labelCell(pDeadCellCoords);   
        }
    }); 

    // wDeadCells.clear(); // = new Map(); 

    pLiveCells.removeCells(false); 
}
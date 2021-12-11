import { CellCoordinates, ListOfCells } from './cellUtils'; 

/**  Applying rules 
 * 1-Any live cell with two or three live neighbours survives.
 * 2-Any dead cell with three live neighbours becomes a live cell.
 *  [Here, the cells get (re)labelled]
 * 3-All other live cells die in the next generation. 
 *      Similarly, all other dead cells stay dead. 
*/
export function applyLifeRules(pLiveCells: ListOfCells): void {
    // TODO: replace by a Set? 
    let wDeadCells: ListOfCells = new ListOfCells(); 
    // K = coordinates
    // V = will die or live at the end of the round 
    let wCellDelta: Map<CellCoordinates, boolean> = new Map(); 
    
    /**
     * Processing live cells 
     * The ones which will die are temporarily stored in the "Delta" map 
     */ 
    pLiveCells.processCells((_, _coords) => {
        let wDeadNeighbors: CellCoordinates[] = pLiveCells.getDeadNeighborCoords(_coords); 
        
        // Live cells in under/overpopulation die 
        const kNbOfLivingNeighbors: number = 8 - wDeadNeighbors.length; 

        if ((kNbOfLivingNeighbors < 2) || (kNbOfLivingNeighbors > 3))
            wCellDelta.set(_coords, false); 
            // TODO: to be removed // LiveCells.set(_coords, false); 

        // The dead neighbours are added to a temp map, so they can be processed right after 
        wDeadNeighbors.forEach(
            (_deadCellCoords: CellCoordinates) => { wDeadCells.set(_deadCellCoords, false) }); 
    }); 

    /**
     * Resurrections 
     * Dead cell with 3 neighbors revive 
     */
    wDeadCells.processCells((_, _deadCellCoords: CellCoordinates) => {
        let livingNeighbors: CellCoordinates[] = pLiveCells.getLivingNeighborCoords(_deadCellCoords);
        
        // The "revivors" are stored in the temp map 
        if (livingNeighbors.length === 3)
            wCellDelta.set(_deadCellCoords, /* cell resurrects */ true );        
    }); 

    // Cells which will resurrect are updated in the main list 
    wCellDelta.forEach((_willLive: boolean, _coords: CellCoordinates) => {
        if (_willLive) // Resurrection
            pLiveCells.set(_coords, /* resurrects */ true);
    });  

    /** 
     * Resurrecting cells (and ONLY those) gets labelled 
     * This will automatically re-label their neighbors, if need be
     * /!\ This must happen: 
     *      - AFTER resurrecting dead cells 
     *      - And BEFORE removing dead cells 
     */
     wCellDelta.forEach((_willLive: boolean, _coords: CellCoordinates) => {
        if (_willLive) 
            pLiveCells.labelCell(_coords);   
    }); 

    // Cells which will die are updated in the main list 
    wCellDelta.forEach((_willLive: boolean, _coords: CellCoordinates) => {
        if (! _willLive) // Death 
        pLiveCells.delete(_coords); 
    }); 
}
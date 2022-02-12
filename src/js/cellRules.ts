import { CellCoordinates } from './cellUtils';
import { ListOfCells } from './ListOfCells'; 

/**  Applying rules 
 * 1-Any live cell with two or three live neighbours survives.
 * 2-Any dead cell with three live neighbours becomes a live cell.
 *  [Here, the cells get (re)labelled]
 * 3-All other live cells die in the next generation. 
 *      Similarly, all other dead cells stay dead. 
*/
export function applyLifeRules(pLiveCells: ListOfCells): void {
    // Set of dead cells 
    let wDeadCells: Set<CellCoordinates> = new Set<CellCoordinates>(); 

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
            (_deadCellCoords: CellCoordinates) => { wDeadCells.add(_deadCellCoords) }); 
    }); 

    /**
     * Resurrections 
     * Dead cell with 3 neighbors revives 
     */
    wDeadCells.forEach((_deadCellCoords: CellCoordinates, _: string) => {
        let livingNeighbors: CellCoordinates[] = pLiveCells.getLivingNeighborCoords(_deadCellCoords);
        
        // The "revivors" are stored in the temp map 
        if (livingNeighbors.length === 3)
            wCellDelta.set(_deadCellCoords, /* cell resurrects */ true );        
    }); 

    // Cells which will resurrect are updated in the main list 
    wCellDelta.forEach((_willLive: boolean, _coords: CellCoordinates) => {
        if (_willLive) // Resurrection
            pLiveCells.set(_coords);
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

    // We might have to split groups, and re-label them
    pLiveCells.splitGroups(); 
}
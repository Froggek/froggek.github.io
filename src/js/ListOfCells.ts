import { CellCoordinates, CellState, getStrCoordinates } from './cellUtils'; 

export class ListOfCells {
     
    private _list: Map<CellCoordinates, CellState> = new Map(); // "x,y" => isAlive?

    public empty(): boolean {
        return ! this._list.size;  
    }

    public has(pCoords: CellCoordinates): boolean {
        return this._list.has(pCoords); 
    }
    private getCell(pCoords: CellCoordinates): CellState | undefined {
        return this._list.get(pCoords); 
    }; 
    public set(pCoords: CellCoordinates): void; 
    public set(pCoords: CellCoordinates, pState: CellState): void; 
    public set(pCoords: CellCoordinates, pGroupId: number): void; 
    public set(pCoords: CellCoordinates, pStateOrGroupId?: CellState | number): void {
        if (pStateOrGroupId === undefined)
            this._list.set(pCoords, new CellState());

        else if (pStateOrGroupId instanceof CellState)
            this._list.set(pCoords, pStateOrGroupId);

        else // Group ID is provided      
            this._list.set(pCoords, new CellState(pStateOrGroupId)); 
    }
    public delete(pCoords: CellCoordinates): boolean {
        return this._list.delete(pCoords); 
    }
    public clear(): void {
        return this._list.clear(); 
    }

    public processCells(pCallBack: (pValue: CellState, pKey: CellCoordinates) => void): void {
        return this._list.forEach(pCallBack); 
    }

    public deepCopy(): ListOfCells {
        let pOut:ListOfCells = new ListOfCells();
        
        this._list.forEach((v: CellState, k: CellCoordinates) => {
            pOut.set(k, v.deepCopy()); 
        }); 

        return pOut; 
    }
    
    // TODO: needs UTs
    public isEqualTo(pRHS: ListOfCells):boolean {
        if (this._list.size !== pRHS._list.size)
            return false; 

        
        for (const [k, v] of this._list) {
            if (! (pRHS.has(k)
                    && (pRHS._list.get(k)?.isEqualTo(v))))
                return false; 
        }
        
        return true; 
    }

    public getGroupId(pCoords: CellCoordinates): number | undefined {
        return this._list.get(pCoords)?.hasGroup() 
            ? this._list.get(pCoords)?.groupId() 
            : undefined; 
    }
    public setGroupId(pCoords: CellCoordinates, pGroupId: number): number | undefined {
        return this.getCell(pCoords)?.setGroupId(pGroupId); 
    }
    public setNewGroupId(pCoords: CellCoordinates): number | undefined {
        return this.getCell(pCoords)?.setNewGroupId();     
    } 

    /** ALL the neighbors */
    private static getNeighborCoordinates(coords: CellCoordinates): Array<CellCoordinates> {
        let result: Array<CellCoordinates> = new Array() ;
    
        const cellIntCoords = ListOfCells.getIntCoordinates(coords); 
    
        for (let x:number = -1; x <= 1; x++) {
            for (let y:number = -1; y <= 1; y++ ) {
                // The cell itself isn't a neighbor 
                if (! ((x === 0) && (y === 0)))
                    result.push( 
                        getStrCoordinates(cellIntCoords.x + x, cellIntCoords.y + y) 
                        /*(cellIntCoords.x + x) + ',' + (cellIntCoords.y + y)*/
                        ); 
            }
        }
    
        return result; 
    }

    public getLivingNeighborCoords(pCoords: CellCoordinates, pSameGroup: boolean = false): CellCoordinates[] {
        return ListOfCells
                .getNeighborCoordinates(pCoords)
                .filter((_neighbor: CellCoordinates) => { 
                    return this.has(_neighbor) 
                        && ((! pSameGroup) || (this.getCell(_neighbor)?.groupId() === this.getCell(pCoords)?.groupId()))
                }); 
    }
    
    public getDeadNeighborCoords(coords: CellCoordinates): CellCoordinates[] {
        return ListOfCells
                .getNeighborCoordinates(coords)
                .filter((neighbor: CellCoordinates) => { return ! this.has(neighbor) }); 
    }

    /** JSON serialization */
    public static getIntCoordinates(coordinates: CellCoordinates): {x:number, y:number} {
        let splitStringCoords = coordinates.split(',');
        
        if (splitStringCoords.length != 2)
            throw "\"" + coordinates + "\" cannot be converted into Integer coordinates"; 

        return {x: parseInt(splitStringCoords[0]), 
                y: parseInt(splitStringCoords[1])};  
    }

    /** 
     * Removes any existing group from the cells, 
     * and resets the group ID counter 
    */
   private clearGroups(): void {
        this.processCells(
            (pState: CellState, _) => { pState.clearGroup(); }); 
        
        CellState.resetGroups(); 
   }

    /** Gives to each set of neighbors a unique group ID  */
    public clearAndLabelGroups(): void {
        this.clearGroups(); 
        let wCellsToLabel: Set<CellCoordinates> = new Set(); 

        this.processCells( (pState, pCoords) => {
            // We only process cells which DON'T already have a group
            if (! pState.hasGroup()) {
                // Let's label the cell 
                pState.setNewGroupId(); 
                wCellsToLabel.add(pCoords);
            }
            
            // Let's build this new group 
            while(wCellsToLabel.size) {
                const wCoords: CellCoordinates = wCellsToLabel.values().next().value; 

                ListOfCells.getNeighborCoordinates(wCoords)
                    .filter( 
                        (pNeighborCoords) => { // Has the neighbor already been labeled? 
                            let wNeighbour: CellState | undefined = this._list.get(pNeighborCoords);  
                            return wNeighbour && (! wNeighbour.hasGroup()); 
                        })
                    .forEach(
                        (pNeighborCoords) =>  { 
                            this._list.get(pNeighborCoords)!.setGroupId(pState.groupId()); 
                            wCellsToLabel.add(pNeighborCoords);  
                        }
                    ); 

                wCellsToLabel.delete(wCoords); 
            }
        }); 

    }

    /** 
     * Labels a single cell, 
     * but also re-labels existing cells in case a merge is required 
     * 
     * Returns: the cell's (new) group ID, or undefined if the cell doesn't exist 
     * 
     * E.g.: 111_222 => 111|*|222 => 111|1|111 
     */
    public labelCell(pCellToLabelCoords: CellCoordinates): number | undefined {
        const kNeighborCoords: CellCoordinates[] = this.getLivingNeighborCoords(pCellToLabelCoords); // All live neighbors  
        
        if (! kNeighborCoords.length)
            return this.setNewGroupId(pCellToLabelCoords); 

        // Are there different group IDs? What's the min one? 
        let wGroupIds: Set<number> = new Set(); 

        kNeighborCoords.forEach( pCoords => {
            let wCell: CellState | undefined = this.getCell(pCoords);
            
            if (wCell && wCell.hasGroup()) 
                wGroupIds.add(wCell.groupId()); 
        });
        
        if (wGroupIds.size === 1) // Single group ==> easy! 
            return this.setGroupId(pCellToLabelCoords, wGroupIds.values().next().value); 

        // Otherwise, multiple groups ==> merge is required 
        // MIN group ID is kept 
        const kMinGroupId: number = Math.min(...wGroupIds); 

        // TODO: move to another function 
        this.processCells((pState: CellState, _: CellCoordinates) => {
            if ( wGroupIds.has(pState.groupId()) )
                pState.setGroupId(kMinGroupId); 
        }); 
        
        return this.setGroupId(pCellToLabelCoords, kMinGroupId); 
    }

    /** Splitting groups */
    public splitGroups(): void {
        const kInitUnreachableGroupId: number = CellState.maxGroupId() + 1; 
        let wCurrentGroupId: number = kInitUnreachableGroupId;
        let wCurrentGroup: Map<CellCoordinates, CellState> = new Map(); 

        this.processCells((_state: CellState, _coords: CellCoordinates) => {
            if (_state.hasGroup())
                wCurrentGroupId = Math.min(wCurrentGroupId, _state.groupId()); 
        }); 

        // Just in case... 
        if (wCurrentGroupId === kInitUnreachableGroupId) 
            return; 
        
        // All the cells from the current group are assigned a temp group ID 
        this.processCells((_state: CellState, _coords: CellCoordinates) => {
            if (_state.groupId() === wCurrentGroupId) {
                _state.setUndefinedGroupId();
                
                // Arbitrarily, the first cell will form the group
                if (! wCurrentGroup.size)
                    wCurrentGroup.set(_coords, _state); 
            }
        }); 

        let wSubGroupId = wCurrentGroupId; 

        while (wCurrentGroup.size) {
            const [[_coords, _state]] = wCurrentGroup; 
            
            // Finding neighbors in the group
            let wNeighborsInGroup = this.getLivingNeighborCoords(_coords, true);
            wNeighborsInGroup.forEach((_neighborCoords: CellCoordinates) => { 
                wCurrentGroup.set(_neighborCoords, this.getCell(_neighborCoords)!) 
            }); 
            // The initial cell gets labelled, and is removed from the temp list
            _state.setGroupId(wSubGroupId);
            wCurrentGroup.delete(_coords);      
        } // End while: the new group is completely formed 
    }
}; 

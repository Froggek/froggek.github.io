export type CellCoordinates = string; 

type ListOfCoordinates = Array< 
                            { 
                                x:number, y:number, 
                                groupID: number 
                            } 
                        >; 
type SituationJSON = { liveCells: ListOfCoordinates }; 

class CellState { 
    private _isAlive: boolean ; 
    private _groupId:number;
    
    private static readonly DEFAULT_GROUP_ID: number = -1; 
    private static _maxGroupId: number = CellState.DEFAULT_GROUP_ID; 

    public static maxGroupId(): number {
        return this._maxGroupId; 
    }

    constructor(pIsAlive: boolean); 
    constructor(pIsAlive: boolean, pGroupId?: number); 
    constructor(pIsAlive:boolean, pGroupId?:number){
        this._isAlive = pIsAlive; 
        this._groupId = (pGroupId ? pGroupId : CellState.DEFAULT_GROUP_ID); 
    }

    public deepCopy(): CellState {
        return new CellState(this._isAlive, this._groupId); 
    }

    // TODO: remove attribute 
    private isAlive(): boolean {
        return this._isAlive; 
    }
    public groupId(): number {
        return this._groupId; 
    } 
    public hasGroup(): boolean {
        return this._groupId > CellState.DEFAULT_GROUP_ID; 
    }
    public clearGroup(): void {
        this._groupId =  CellState.DEFAULT_GROUP_ID; 
    }
    public static resetGroups(): void {
        CellState._maxGroupId = CellState.DEFAULT_GROUP_ID; 
    }

    public isEqualTo(pRHS: CellState): boolean {
        return (this.isAlive() === pRHS.isAlive()) 
            && (this.groupId() === pRHS.groupId()); 
    }

    public setGroupId(pGroupId: number): number {
        CellState._maxGroupId = Math.max(CellState._maxGroupId, pGroupId);  
        this._groupId = pGroupId; 

        return this._groupId; 
    }
    public setNewGroupId(): number {
        return this.setGroupId(CellState._maxGroupId + 1); 
    }
};

export class ListOfCells  {
     
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
    public set(pCoords: CellCoordinates, pState: CellState): void; 
    public set(pCoords: CellCoordinates, pIsAlive: boolean, pGroupId?: number): void; 
    public set(pCoords: CellCoordinates, pStateOrIsAlive: CellState | boolean, pGroupId?: number): void {
        if (pStateOrIsAlive instanceof CellState)
            this._list.set(pCoords, pStateOrIsAlive); 
        else         
            this._list.set(pCoords, new CellState(pStateOrIsAlive, pGroupId)); 
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

    // TODO: remove 
    public removeCells(pWhenToRemoveCriteria: (_state: CellState) => boolean): void {
        for (const [k, v] of this._list) {

            if (pWhenToRemoveCriteria(v))
                this._list.delete(k); 
        }
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

    public getLivingNeighborCoords(coords: CellCoordinates): CellCoordinates[] {
        const neighborCoords:CellCoordinates[] = ListOfCells.getNeighborCoordinates(coords);
    
        return neighborCoords
                .filter((neighbor: CellCoordinates) => { return this.has(neighbor) }); 
    }
    
    public getDeadNeighborCoords(coords: CellCoordinates): CellCoordinates[] {
        const neighborCoords:CellCoordinates[] = ListOfCells.getNeighborCoordinates(coords);
        
        return neighborCoords.filter((neighbor: CellCoordinates) => { return ! this.has(neighbor) }); 
    }

    /** JSON serialization */
    public static getIntCoordinates(coordinates: CellCoordinates): {x:number, y:number} {
        let splitStringCoords = coordinates.split(',');
        
        if (splitStringCoords.length != 2)
            throw "\"" + coordinates + "\" cannot be converted into Integer coordinates"; 

        return {x: parseInt(splitStringCoords[0]), 
                y: parseInt(splitStringCoords[1])};  
    }

    public serializeSituation2JSON(): string {
        let result: SituationJSON = { liveCells: [] };  

        this.processCells( (v, k: CellCoordinates) => {
            let { x, y } = ListOfCells.getIntCoordinates(k);  
            result.liveCells.push({ 
                x, y, 
                groupID: v.groupId() }); 
        } ); 
        
        return JSON.stringify(result); 
    } 

    public hydrateSituationFromJSON(pRawSituation: string): void {
        const kObj:any = JSON.parse(pRawSituation);
        
        if (! (kObj as SituationJSON).liveCells)
            throw 'The given input cannot be interpreted as a game situation'; 
        
        this.clear(); 

        (kObj as SituationJSON).liveCells.forEach(
            // TODO: do we want to serialize the groups? 
            pCell => this.set( getStrCoordinates(pCell.x, pCell.y), true, pCell.groupID )); 
    }

    /** 
     * Removes any existing group from teh cells, 
     * and resets the group IS counter 
    */
   public clearGroups(): void {
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
}; 

export function getStrCoordinates(x: string, y:string): CellCoordinates; 
export function getStrCoordinates(x: number, y:number): CellCoordinates; 
export function getStrCoordinates(coords: any[]): CellCoordinates; 
export function getStrCoordinates(x:any, y?:any): CellCoordinates {
    let xStr, yStr: string;

    if (x && Array.isArray(x)){ // Caution, we assume x.length === 2 
        xStr = x[0].toString(); 
        yStr = x[1].toString(); 
    } else {
        xStr = x.toString();
        yStr = y.toString();  
    }

    return xStr + ',' + yStr; 
} 

/** Basic object operations */

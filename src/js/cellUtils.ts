export type CellCoordinates = string; 

type ListOfCoordinates = Array<Array<number>>; 
type SituationJSON = { liveCells: ListOfCoordinates }; 

class CellState { 
    private _isAlive: boolean ; 
    private _groupId:number;
    
    private static _maxGroupId: number = -1; 

    public static maxGroupId(): number {
        return this._maxGroupId; 
    }

    constructor(pIsAlive: boolean); 
    constructor(pIsAlive: boolean, pGroupId?: number); 
    constructor(pIsAlive:boolean, pGroupId?:number){
        this._isAlive = pIsAlive; 
        this._groupId = (pGroupId ? pGroupId : -1); 
    }

    public deepCopy(): CellState {
        return new CellState(this._isAlive, this._groupId); 
    }

    public isAlive(): boolean {
        return this._isAlive; 
    }
    public groupId(): number {
        return this._groupId; 
    } 
    public hasGroup(): boolean {
        return this._groupId >= 0; 
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


    public has(pCoords: CellCoordinates): boolean {
        return this._list.has(pCoords); 
    }
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

    public removeCells(pRemoveIfAlive: boolean): void {
        for (const [k, v] of this._list) {
            if (v.isAlive() === pRemoveIfAlive)
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

        this._list.forEach( (v, k) => {
            let { x, y } = ListOfCells.getIntCoordinates(k);  
            result.liveCells.push([x, y]); 
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
            coords => this.set( getStrCoordinates(coords), true )); 
    }

    public harmonizeGroup(pCellsToHarmonize: CellCoordinates[], pSingleGroupId: number): void {
        pCellsToHarmonize.forEach((pCoords: CellCoordinates) => {
            if (! this.has(pCoords)) 
                return; 
            
            const kPreviousGroupId = this._list.get(pCoords)?.groupId(); 

            if (kPreviousGroupId !== pSingleGroupId) {
                // We need to change the neighbor's group ID ... and all its neighbors'! 
                this._list.forEach( (k: CellState) => { 
                    if (k.groupId() === kPreviousGroupId)
                        k.setGroupId(pSingleGroupId); 
                 }); 
            }
        }); 
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

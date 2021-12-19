export class CellCoordinates extends String {}; 

export class CellState { 
    private _groupId:number;
    
    private static readonly DEFAULT_GROUP_ID: number = -1; 
    private static _maxGroupId: number = CellState.DEFAULT_GROUP_ID; 

    public static maxGroupId(): number {
        return this._maxGroupId; 
    }

    constructor(); 
    constructor(pGroupId: number); 
    constructor(pGroupId?:number){
        this._groupId = (pGroupId ? pGroupId : CellState.DEFAULT_GROUP_ID); 
    }

    public deepCopy(): CellState {
        return new CellState(this._groupId); 
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
        return (this.groupId() === pRHS.groupId()); 
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


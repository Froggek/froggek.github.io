export class CellCoordinates extends String {}; 

export class GroupID extends Number {
    constructor(pGroupId: number) {
        super(pGroupId); 
    }

    public toNumber(): number {
        return Number(this); 
    }
}; 

export class CellState { 
    private _groupId:GroupID;
    
    private static readonly DEFAULT_GROUP_ID: GroupID = new GroupID(-1); 
    private static _maxGroupId: GroupID = CellState.DEFAULT_GROUP_ID; 

    public static maxGroupId(): GroupID {
        return this._maxGroupId; 
    }
    public static newGroupId(): GroupID {
        return new GroupID(Number(this.maxGroupId()) + 1); 
    }
    public static defaultGroupId(): GroupID {
        return this.DEFAULT_GROUP_ID; 
    }

    constructor(); 
    constructor(pGroupId: GroupID); 
    constructor(pGroupId?:GroupID){
        this._groupId = (pGroupId ? pGroupId : CellState.DEFAULT_GROUP_ID); 
    }

    public deepCopy(): CellState {
        return new CellState(this._groupId); 
    }

    public groupId(): GroupID {
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

    private updateGroupId(pGroupId: GroupID, pUpdateMaxGroupId: boolean): GroupID {
        if (pUpdateMaxGroupId)
            CellState._maxGroupId = new GroupID(Math.max(Number(CellState._maxGroupId), Number(pGroupId)));  
        
        this._groupId = pGroupId; 

        return this._groupId; 
    }
    public setGroupId(pGroupId: GroupID): GroupID {
        return this.updateGroupId(pGroupId, true); 
    }
    public setUndefinedGroupId(): GroupID {
        return this.updateGroupId(CellState.DEFAULT_GROUP_ID, false); 
    }
    public setNewGroupId(): GroupID {
        return this.setGroupId(CellState.newGroupId()); 
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


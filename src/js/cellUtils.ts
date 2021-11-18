export type CellCoordinates = string; 

export class ListOfCells  {
    private _list: Map<CellCoordinates, boolean> = new Map(); // "x,y" => isAlive?


    public has(pCoords: CellCoordinates): boolean {
        return this._list.has(pCoords); 
    }
    public set(pCoords: CellCoordinates, pIsAlive: boolean): void {
        this._list.set(pCoords, pIsAlive); 
    }
    public delete(pCoords: CellCoordinates): boolean {
        return this._list.delete(pCoords); 
    }
    public clear(): void {
        return this._list.clear(); 
    }

    public processCells(pCallBack: (pValue:boolean, pKey: CellCoordinates) => void): void {
        return this._list.forEach(pCallBack); 
    }

    public removeCells(pRemoveIfAlive: boolean): void {
        for (const [k, v] of this._list) {
            if (v === pRemoveIfAlive)
                this._list.delete(k); 
        }
    }

    public deepCopy(): ListOfCells {
        let pOut:ListOfCells = new ListOfCells();
        
        this._list.forEach((v,k) => {
            pOut.set(k, v); 
        }); 

        return pOut; 
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
            coords => this.set( getStrCoordinates(coords), true )); 
    }
}; 

type ListOfCoordinates = Array<Array<number>>; 
type SituationJSON = { liveCells: ListOfCoordinates }; 

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

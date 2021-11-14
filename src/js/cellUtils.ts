export type CellCoordinates = string; 
export type ListOfCells = Map<CellCoordinates, boolean>; // "x,y" => isAlive?

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

export function getIntCoordinates(coordinates: CellCoordinates): {x:number, y:number} {
    let splitStringCoords = coordinates.split(',');
    
    if (splitStringCoords.length != 2)
        throw "\"" + coordinates + "\" cannot be converted into Integer coordinates"; 

    return {x: parseInt(splitStringCoords[0]), 
            y: parseInt(splitStringCoords[1])};  
}

export function serializeSituation2JSON(cells: ListOfCells): string {

    let result: SituationJSON = { liveCells: [] };  

    cells.forEach( (v, k) => {
        let { x, y } = getIntCoordinates(k);  
        result.liveCells.push([x, y]); 
    } ); 
    
    return JSON.stringify(result); 
} 

export function hydrateSituationFromJSON(pRawSituation: string, pCells: ListOfCells): void {
    const kObj:any = JSON.parse(pRawSituation);
    
    if (! (kObj as SituationJSON).liveCells)
        throw 'The given input cannot be interpreted as a game situation'; 
    
    pCells.clear(); 

    (kObj as SituationJSON).liveCells.forEach(
        coords => pCells.set( getStrCoordinates(coords), true )); 
}
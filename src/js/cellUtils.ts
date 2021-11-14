export type CellCoordinates = string; 
export type ListOfCells = Map<CellCoordinates, boolean>; // "x,y" => isAlive?

type ListOfCoordinates = Array<Array<number>>; 
type SituationJSON = { liveCells: ListOfCoordinates }; 

export function getStrCoordinates(x: string, y:string): CellCoordinates; 
export function getStrCoordinates(x: number, y:number): CellCoordinates; 
export function getStrCoordinates(x:any, y:any): CellCoordinates {
    return x.toString() + ',' + y.toString(); 
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
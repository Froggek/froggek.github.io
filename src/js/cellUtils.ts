export type CellCoordinates = string; 
export type ListOfCells = Map<CellCoordinates, boolean>; // "x,y" => isAlive?

export function getCoordinatesFromInt(x:number, y:number): CellCoordinates {
    return x + ',' + y; 
} 

export function getIntCoordinates(coordinates: CellCoordinates): {x:number, y:number} {
    let splitStringCoords = coordinates.split(',');
    
    if (splitStringCoords.length != 2)
        throw "\"" + coordinates + "\" cannot be converted into Integer coordinates"; 

    return {x: parseInt(splitStringCoords[0]), 
            y: parseInt(splitStringCoords[1])};  
}

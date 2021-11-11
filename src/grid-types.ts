type CellCoordinates = string; 
type ListOfCells = Map<CellCoordinates, boolean>; // "x,y" => isAlive?

interface GridUIComponents {
    repeat?: NodeJS.Timer; 
}; 

function getCoordinatesFromInt(x:number, y:number): CellCoordinates {
    return x + ',' + y; 
} 
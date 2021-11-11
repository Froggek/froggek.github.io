export type CellCoordinates = string; 
export type ListOfCells = Map<CellCoordinates, boolean>; // "x,y" => isAlive?

export interface GridUIComponents {
    repeat?: NodeJS.Timer; 
}; 

export function getCoordinatesFromInt(x:number, y:number): CellCoordinates {
    return x + ',' + y; 
} 
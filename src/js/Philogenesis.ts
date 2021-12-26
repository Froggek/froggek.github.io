import { CellCoordinates } from './cellUtils'; 
import { ListOfCells } from './ListOfCells';

class ListOfCordinates extends Set<CellCoordinates> {}; 

class Genealogy extends ListOfCordinates {
    // private _historySteps: ListOfCordinates = new ListOfCordinates(); 
}; 

class Philogenesis {
    private _genealogiesByGroup: Map<number, Genealogy> = new Map(); 
}; 

export class Ecosystem {
    public livingCells: ListOfCells = new ListOfCells(); 
    private _philogenesis: Philogenesis = new Philogenesis(); 
}; 



import { CellCoordinates, CellState } from './cellUtils'; 
import { ListOfCells } from './ListOfCells';
import { Cycle } from './cycles';

class ListOfCordinates extends Set<CellCoordinates> {
    
    public isEqualTo(pRHS: ListOfCordinates): boolean {
        if (this.size !== pRHS.size)
            return false; 
        
        for (let _elt of this) {
            if (! pRHS.has(_elt))
                return false; 
        } 

        return true; 
    }
}; 

class Genealogy extends Array<ListOfCordinates> {
    private _cycle: Cycle = new Cycle(); 

    public addCellCoordinatesToCurrentGeneration(pCoords: CellCoordinates): void {
        this.at(-1)?.add(pCoords); 
    } 

    public updateCycleFromCurrentGeneration(): void { 
        let i: number = this.length - 2;
        const kLastGeneration: ListOfCordinates = this[i + 1]; 
        let wFound: boolean = false; 

        while ((! wFound) && (i >= 0)) {
            wFound = this[i].isEqualTo(kLastGeneration); 
            i--; 
        } 

        if (wFound) 
            this._cycle.setLength((this.length - 1) - (i + 1)); 
        else 
            this._cycle.resetLength(); 
    }

    public hasCycle(): boolean {
        return this._cycle.getLength() !== Cycle.NO_CYCLE_LENGTH; 
    }
    public getCycleLength(): number {
        if (this.hasCycle())
            return this._cycle.getLength(); 
        
        return 0; 
    }
}; 

class Philogenesis {
    private _genealogiesByGroup: Map<number, Genealogy> = new Map(); 

    private addNewGenerationToGroup(pGroupId: number): void {
        // If the group has no genealogy yet, we create it 
        if (! this._genealogiesByGroup.has(pGroupId))
            this._genealogiesByGroup.set(pGroupId, new Genealogy()); 

        this._genealogiesByGroup.get(pGroupId)?.push(new ListOfCordinates()); 
    }

    private addCellToLatestGeneration(pGroupId: number, pCoords: CellCoordinates): void {
        this._genealogiesByGroup.get(pGroupId)?.addCellCoordinatesToCurrentGeneration(pCoords); 
    }

    private removeGenealogy(pGroupId: number): boolean {
        return this._genealogiesByGroup.delete(pGroupId); 
    }

    private removeGenealogies(pGroupIds: Set<number>): void {
        this._genealogiesByGroup.forEach((_, _groupId: number) => {
            if (! pGroupIds.has(_groupId))
                this.removeGenealogy(_groupId); 
        }); 
    }

    public addNewGeneration(pCells: ListOfCells): void {
        // For each group, do we already have the new generation? 
        let wGroupsWithNewGeneration: Set<number> = new Set();
        
        pCells.processCells((_state: CellState, _coords: CellCoordinates) => {
            if (! _state.hasGroup())
                return; 
            
            const kGroupId = _state.groupId(); 
            
            // Is the generation has not been added, we create it now
            if (! wGroupsWithNewGeneration.has(kGroupId)) {
                this.addNewGenerationToGroup(kGroupId);
                wGroupsWithNewGeneration.add(kGroupId); 
            } 
            
            this.addCellToLatestGeneration(kGroupId, _coords);             
        });
        
        // All the groups which don't have a new generation need to be removed
        this.removeGenealogies(wGroupsWithNewGeneration); 
    }
    
    public updateCycles(): void {
        this._genealogiesByGroup.forEach((_genealogy: Genealogy, _) => {
            _genealogy.updateCycleFromCurrentGeneration(); 
        }); 
    }

    public processCycles(pCallBack: (_groupId: number, _hasCycle: boolean, _length: number) => void): void {
        this._genealogiesByGroup.forEach(
            (_genealogy: Genealogy, _groupId: number) => {
                pCallBack(_groupId, _genealogy.hasCycle(), _genealogy.getCycleLength()); 
            }); 
    }

}; 

export class Ecosystem {
    public livingCells: ListOfCells = new ListOfCells(); 
    private _philogenesis: Philogenesis = new Philogenesis(); 

    public recordNewGeneration(): void {
        this._philogenesis.addNewGeneration(this.livingCells); 
    }

    public udpateCycles(): void {
        this._philogenesis.updateCycles(); 
    }

    public processCycles(pCallBack: (_groupId: number, _hasCycle: boolean, _length: number) => void): void {
        this._philogenesis.processCycles(pCallBack); 
    }
}; 



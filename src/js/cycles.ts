import { ListOfCells } from './cellUtils'; 

type Situation = ListOfCells; 

class Cycle {
    _length: number = 0; 

    constructor(pLength: number) {
        this._length = pLength; 
    }
}; 

export class SituationMemory {
    private _situations: Array<Situation> = new Array();
    private _cycles: Array<Cycle> = new Array(); 

    public addSituation(pSituation: Situation) {
        this._situations.push(pSituation.deepCopy()); 
    } 

    public hasCycles(): boolean {
        return !! this._cycles.length; 
    }

    private searchCycleWithLastSituation(): Cycle | null { 
        let i: number = this._situations.length - 2;
        const kLastSituation: Situation = this._situations[i + 1]; 
        let wFound: boolean = false; 

        while ((! wFound) && (i >= 0)) {
            wFound = this._situations[i].isEqualTo(kLastSituation); 
            i--; 
        } 

        return ( wFound? new Cycle((this._situations.length - 1) - (i + 1)): null ); 
    }

    public searchForCycles(): void {
        if (this.hasCycles())
            return; 
        
        let pCycle: Cycle | null = this.searchCycleWithLastSituation(); 

        if (pCycle)
            this._cycles.push(pCycle); 
    }

    public processCycles(pCallBack: (pLength: number) => void): void {
        this._cycles.forEach(_c => { pCallBack(_c._length) }); 
    }
}; 


import { ListOfCells } from './cellUtils'; 

type Situation = ListOfCells; 

export class SituationMemory {
    private _situations: Array<Situation> = new Array();

    public addSituation(pSituation: Situation) {
        this._situations.push(pSituation.deepCopy()); 
    } 

    public isLastSituationInCycle(): boolean { 
        let i: number = this._situations.length - 2;
        const kLastSituation: Situation = this._situations[i + 1]; 
        let wFound: boolean = false; 

        while ((! wFound) && (i >= 0)) {
            wFound = this._situations[i].isEqualTo(kLastSituation); 
            i--; 
        } 

        return wFound; 
    }

     
}; 


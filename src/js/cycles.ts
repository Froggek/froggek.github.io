export class Cycle {
    public static readonly NO_CYCLE_LENGTH: number = 0;  
    private _length: number; 
    
    constructor(); 
    constructor(pLength: number); 
    constructor(pLength?: number) {
        if (pLength)
            this._length = pLength;
        else 
            this._length = Cycle.NO_CYCLE_LENGTH;  
    }

    public getLength(): number {
        return this._length; 
    }
    public setLength(pLength: number): void {
        this._length = pLength; 
    }
    public resetLength(): void {
        this.setLength(Cycle.NO_CYCLE_LENGTH); 
    }
}; 



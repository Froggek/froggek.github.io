import { CellCoordinates, getStrCoordinates } from './cellUtils'; 
import { ListOfCells } from './ListOfCells'; 

type ListOfCoordinatesJSON = Array< 
                            { 
                                x:number, y:number, 
                                groupID?: number 
                            } 
                        >; 

type SituationJSON = { liveCells: ListOfCoordinatesJSON }; 

export function serializeToJSON(pCells: ListOfCells): string {
    let result: SituationJSON = { liveCells: [] };  

    pCells.processCells( (_state, _coords: CellCoordinates) => {
            let { x, y } = ListOfCells.getIntCoordinates(_coords);  
            result.liveCells.push({ 
                x, y 
                // groupID: v.groupId() 
            }); 
        } ); 
        
        return JSON.stringify(result); 
}

export function deserializeFromJSON(pRawList: string, oList: ListOfCells): void {
    const kObj:any = JSON.parse(pRawList);
        
    if (! (kObj as SituationJSON).liveCells)
        throw 'The given input cannot be interpreted as a game situation'; 
        
    oList.clear(); 

    (kObj as SituationJSON).liveCells.forEach(
        // TODO: do we want to serialize the groups? 
        _cell => oList.set( getStrCoordinates(_cell.x, _cell.y) /*, pCell.groupID */ )); 
}





import $ from 'jquery'; 

import { ListOfCells, getStrCoordinates, serializeSituation2JSON } from './cellUtils'; 

export const HTML_GRID_BODY_ID:string = 'game-grid-body'; 
export const CSS_LIVE_CELL_CLASS_NAME: string = 'live-cell'; 


export interface GridUIComponents {
    repeat?: NodeJS.Timer; 
}; 

export function addGridListeners(pLivingCells: ListOfCells, pDocument: Document): void {
    $(pDocument).on('click', event => {
        let kHtmlElt: JQuery<Document> = $(event.target); 

        // Has the user clicked on the grid?  
        if (kHtmlElt.is(`#${HTML_GRID_BODY_ID} *`)) {

            // Is the cell dead or alive?
            const kStrCoords:string = getStrCoordinates( /* x= */ kHtmlElt.data('col'), /* y= */ kHtmlElt.parent().data('row') ); 

            if (pLivingCells.has(kStrCoords)) { // Alive => Dead 
                pLivingCells.delete(kStrCoords); 
                kHtmlElt.removeClass(CSS_LIVE_CELL_CLASS_NAME);  
            } else { // Dead => Alive
                pLivingCells.set(kStrCoords, true);
                kHtmlElt.addClass(CSS_LIVE_CELL_CLASS_NAME); 
            }
        } 
    });     
}

export function addGridButtonListeners(pLivingCells: ListOfCells, pDeadCells: ListOfCells, 
        pLifeRound: (l: ListOfCells, d: ListOfCells) => void, 
        pComponents: GridUIComponents): void {

    // Start/Pause button 
    $('#start-btn').on('click', e => { 
        // TODO use https://getbootstrap.com/docs/5.1/components/buttons/#toggle-states
        if ($(e.target).text() === 'GO!') {
            pComponents.repeat = setInterval(() => { 
                pLifeRound(pLivingCells, pDeadCells) }, 1000);

            $(e.target).text('Pause'); 
        } else {
            if (pComponents.repeat) {
                clearInterval(pComponents.repeat);     
                pComponents.repeat = undefined; 
            }
            
            $(e.target).text('GO!'); 
        }
    });

    // Export btn 
    $('#export-btn').on('click', e => {
        // TODO: check it's paused 
        alert(serializeSituation2JSON(pLivingCells)); 
    }); 


}

export function updateUI(pLiveCells: ListOfCells, pDeadCells: ListOfCells): void {
    let tableBody: JQuery<HTMLElement> = $(`#${HTML_GRID_BODY_ID}`); 

    const kNbRows:number = 30; 
    const kShiftY: number = Math.floor(kNbRows / 2); 
    const kNbColumns:number = 30; 
    const kShiftX:number = Math.floor(kNbColumns / 2); 

    tableBody.html(''); 

    for (let i:number = 0; i < kNbRows; i++) {
        let tr: string = '<tr data-row="' + (i - kShiftY) + '">';

        for (let j:number = 0; j < kNbColumns; j++) {
            tr += '<td data-col="' + (j - kShiftX) + '"' 
                + (pLiveCells.has(getStrCoordinates(j - kShiftX, i - kShiftY)) 
                    ? `class="${CSS_LIVE_CELL_CLASS_NAME}"` : '') 
                + ' ></td>'; 
        }
        tableBody.append(tr + '</tr>'); 
    }
}
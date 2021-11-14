import $ from 'jquery'; 

import { ListOfCells, getStrCoordinates, serializeSituation2JSON } from './cellUtils'; 

const HTML_GRID_BODY_ID:string = 'game-grid-body'; 
const HTML_EXPORT_AREA_ID:string = 'export-area'; 
const HTML_START_PAUSE_BTN_ID: string = 'start-btn'; 

const CSS_LIVE_CELL_CLASS_NAME: string = 'live-cell'; 

export enum GameStatus {
    PLAYING = "PLAYING", 
    PAUSED = "PAUSED"
}; 

export interface GridUIComponents {
    status: GameStatus; 
    repeat?: NodeJS.Timer; 
}; 

export function addGridListeners(pLivingCells: ListOfCells, pDocument: Document): void {
    $(pDocument).on('click', event => {
        const kHtmlElt: JQuery<Document> = $(event.target); 

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

function updateBtnState(pBtnID: string, pComponents: GridUIComponents): void {
    switch (pBtnID) {
        case HTML_START_PAUSE_BTN_ID: 
            (pComponents.status === GameStatus.PLAYING) ?
                $(`#${HTML_START_PAUSE_BTN_ID}`).text('Pause') : 
                $(`#${HTML_START_PAUSE_BTN_ID}`).text('GO!');  
                // TODO use https://getbootstrap.com/docs/5.1/components/buttons/#toggle-states
            break;

        default: 
            throw `There is no button with the name ${pBtnID}`; 
    }; 
}

export function addGridButtonListeners(pLivingCells: ListOfCells, pDeadCells: ListOfCells, 
        pLifeRound: (l: ListOfCells, d: ListOfCells) => void, 
        pComponents: GridUIComponents): void {

    // Start/Pause button 
    $(`#${HTML_START_PAUSE_BTN_ID}`).on('click', e => { 
        if (pComponents.status === 'PAUSED') { // Pause => Playing
            pComponents.repeat = setInterval(() => { 
                pLifeRound(pLivingCells, pDeadCells) }, 1000);
            pComponents.status = GameStatus.PLAYING; 
        } else { // Playing => Pause 
            if (pComponents.repeat) {
                clearInterval(pComponents.repeat);     
                pComponents.repeat = undefined; 
            }
            pComponents.status = GameStatus.PAUSED; 
        }

        updateBtnState(HTML_START_PAUSE_BTN_ID, pComponents); 
    });

    // Export btn 
    $('#export-btn').on('click', e => {
        if (pComponents.status === GameStatus.PAUSED) {
            $(`#${HTML_EXPORT_AREA_ID}`).text(serializeSituation2JSON(pLivingCells)); 
        } else 
            alert('Cannot export while the game is running'); 
    }); 


}

export function updateUI(pLiveCells: ListOfCells, pDeadCells: ListOfCells): void {
    // Updating the GRID 
    const kTableBody: JQuery<HTMLElement> = $(`#${HTML_GRID_BODY_ID}`); 

    const kNbRows:number = 30; 
    const kShiftY: number = Math.floor(kNbRows / 2); 
    const kNbColumns:number = 30; 
    const kShiftX:number = Math.floor(kNbColumns / 2); 

    kTableBody.html(''); 

    for (let i:number = 0; i < kNbRows; i++) {
        let tr: string = '<tr data-row="' + (i - kShiftY) + '">';

        for (let j:number = 0; j < kNbColumns; j++) {
            tr += '<td data-col="' + (j - kShiftX) + '"' 
                + (pLiveCells.has(getStrCoordinates(j - kShiftX, i - kShiftY)) 
                    ? `class="${CSS_LIVE_CELL_CLASS_NAME}"` : '') 
                + ' ></td>'; 
        }
        kTableBody.append(tr + '</tr>'); 
    }

    // Updating the button states 

}
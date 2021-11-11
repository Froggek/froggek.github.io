import $ from 'jquery'; 

import './grid-types'; 

export function clickOnGridListener(pLivingCells: ListOfCells, pDocument: Document): void {
    $(pDocument).on('click', event => {
        // TODO: check whether the user clicks on the grid 
        $(event.target).toggleClass('dead-cell');
    
        pLivingCells.set($(event.target).data('col') 
                            + ',' 
                            + $(event.target).parent().data('row'), true); 
    });     
}

export function clickOnStartListener(pLivingCells: ListOfCells, pDeadCells: ListOfCells, 
        pLifeRound: (l: ListOfCells, d: ListOfCells) => void, 
        pComponents: GridUIComponents): void {

    $('#start-btn').on('click', e => {
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
}

export function updateUI(pLiveCells: ListOfCells, pDeadCells: ListOfCells): void {
    let tableBody: JQuery<HTMLElement> = $('#game-grid-body'); 

    const NB_ROWS:number = 30; 
    const SHIFT_Y: number = Math.floor(NB_ROWS / 2); 
    const NB_COLUMNS:number = 30; 
    const SHIFT_X:number = Math.floor(NB_COLUMNS / 2); 

    tableBody.html(''); 

    for (let i:number = 0; i < NB_ROWS; i++) {
        let tr: string = '<tr data-row="' + (i - SHIFT_Y) + '">';

        for (let j:number = 0; j < NB_COLUMNS; j++) {
            tr += '<td data-col="' + (j - SHIFT_X) + '"' 
                + (pLiveCells.has(getCoordinatesFromInt(j - SHIFT_X, i - SHIFT_Y)) 
                    ? 'class="dead-cell"' : '') 
                + ' ></td>'; 
        }
        tableBody.append(tr + '</tr>'); 
    }
}
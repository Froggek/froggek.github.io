import $ from 'jquery';
import './grid-types';
export function clickOnGridListener(pLivingCells, pDocument) {
    $(pDocument).on('click', event => {
        $(event.target).toggleClass('dead-cell');
        pLivingCells.set($(event.target).data('col')
            + ','
            + $(event.target).parent().data('row'), true);
    });
}
export function clickOnStartListener(pLivingCells, pDeadCells, pLifeRound, pComponents) {
    $('#start-btn').on('click', e => {
        if ($(e.target).text() === 'GO!') {
            pComponents.repeat = setInterval(() => {
                pLifeRound(pLivingCells, pDeadCells);
            }, 1000);
            $(e.target).text('Pause');
        }
        else {
            if (pComponents.repeat) {
                clearInterval(pComponents.repeat);
                pComponents.repeat = undefined;
            }
            $(e.target).text('GO!');
        }
    });
}
export function updateUI(pLiveCells, pDeadCells) {
    let tableBody = $('#game-grid-body');
    const NB_ROWS = 30;
    const SHIFT_Y = Math.floor(NB_ROWS / 2);
    const NB_COLUMNS = 30;
    const SHIFT_X = Math.floor(NB_COLUMNS / 2);
    tableBody.html('');
    for (let i = 0; i < NB_ROWS; i++) {
        let tr = '<tr data-row="' + (i - SHIFT_Y) + '">';
        for (let j = 0; j < NB_COLUMNS; j++) {
            tr += '<td data-col="' + (j - SHIFT_X) + '"'
                + (pLiveCells.has(getCoordinatesFromInt(j - SHIFT_X, i - SHIFT_Y))
                    ? 'class="dead-cell"' : '')
                + ' ></td>';
        }
        tableBody.append(tr + '</tr>');
    }
}
//# sourceMappingURL=grid-ui.js.map
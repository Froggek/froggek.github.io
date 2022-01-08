import $ from 'jquery';

import { getStrCoordinates, CellCoordinates } from './cellUtils';
import { ListOfCells } from './ListOfCells';
import { serializeToJSON } from './cellJSONFormats';
import { Ecosystem } from './Philogenesis';

const HTML_GRID_BODY_ID:string = 'game-grid-body';
const HTML_EXPORT_AREA_ID:string = 'export-area';
const HTML_CYCLES_AREA_ID: string ='cycles-panel-content';
const HTML_START_PAUSE_BTN_ID: string = 'start-btn';
const HTML_EXPORT_BTN_ID: string = 'export-btn'; 
const HTML_LABEL_REFRESH_BTN_ID: string = 'label-and-paint-btn'; 
const HTML_SPLIT_GROUPS_BTN_ID: string = 'split-groups-btn'; 

const CSS_LIVE_CELL_CLASS_NAME: string = 'live-cell';

const CSS_GROUP_COLORS = [ /* "black", */ "silver", "gray", "maroon", "red", 
    "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua" ];


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
            const kStrCoords:CellCoordinates = getStrCoordinates( /* x= */ kHtmlElt.data('col'), /* y= */ kHtmlElt.parent().data('row') );

            if (pLivingCells.has(kStrCoords)) { // Alive => Dead
                pLivingCells.delete(kStrCoords);
                kHtmlElt.removeClass(CSS_LIVE_CELL_CLASS_NAME);
                kHtmlElt.css('background-color', ''); 
            } else { // Dead => Alive
                pLivingCells.set(kStrCoords);
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


export function addGridButtonListeners(pEcosystem: Ecosystem,
        pComponents: GridUIComponents, 
        pLifeRound: (l: ListOfCells) => void,
        pCycleDetection: (e: Ecosystem) => void,
        pInitialLabelling? : (l: ListOfCells) => void): void {

    // Start/Pause button
    $(`#${HTML_START_PAUSE_BTN_ID}`).on('click', e => {
        if (pComponents.status === 'PAUSED') { // Pause => Playing
            /** Initialization */
            if (pInitialLabelling)
                pInitialLabelling(pEcosystem.livingCells);
            
            // The currnet living cells form the first generation 
            pEcosystem.recordNewGeneration(); 

            /** Here we go! */
            pComponents.repeat = setInterval(() => 
                {
                    pLifeRound(pEcosystem.livingCells);  
                    pCycleDetection(pEcosystem);
                }, 
                1000);

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
    $(`#${HTML_EXPORT_BTN_ID}`).on('click', e => {
        if (pComponents.status === GameStatus.PAUSED) {
            $(`#${HTML_EXPORT_AREA_ID}`).text(serializeToJSON(pEcosystem.livingCells));
        } else
            alert('Cannot export while the game is running');
    });

    /**  DEBUG STUFFS */
    // Label groups & Refresh UI
    $(`#${HTML_LABEL_REFRESH_BTN_ID}`).on('click', e => {
        if (pComponents.status === GameStatus.PAUSED) {
            pEcosystem.livingCells.clearAndLabelGroups(); 
            updateUI(pEcosystem.livingCells); 
        } else
            alert('Cannot export while the game is running');
    });  

    // Split groups
    $(`#${HTML_SPLIT_GROUPS_BTN_ID}`).on('click', e => {
        if (pComponents.status === GameStatus.PAUSED) {
            pEcosystem.livingCells.splitGroups(); 
            updateUI(pEcosystem.livingCells); 
        } else
            alert('Cannot export while the game is running');
    }); 
}

export function updateUI(pLiveCells: ListOfCells): void {
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
            const kStrCoords: CellCoordinates = getStrCoordinates(j - kShiftX, i - kShiftY);
            const kGroupId: number | undefined = pLiveCells.getGroupId(kStrCoords);

            tr += '<td data-col="' + (j - kShiftX) + '" '
                // Dead or alive
                + (pLiveCells.has(kStrCoords) ? `class="${CSS_LIVE_CELL_CLASS_NAME}" ` : '')
                // TODO: should be a class...
                + ((kGroupId !== undefined) ? 
                        'style="background-color: ' + CSS_GROUP_COLORS[kGroupId % CSS_GROUP_COLORS.length] + ';" ' 
                        : '')
                + ' ></td>'
                ;
        }
        kTableBody.append(tr + '</tr>');
    }
}

export function displayCycles(pEcosystem: Ecosystem): void {
    let wListOfCycles: string = '';

    pEcosystem.processCycles(
        (pGroupId: number, pHasCycle: boolean, pLength: number) => {
            wListOfCycles += 
                '<li ' + (pHasCycle? 'style="color: ' + CSS_GROUP_COLORS[pGroupId % CSS_GROUP_COLORS.length] + ';"' : '') + '>' + 
                    'Group: ' + pGroupId.toString() + 
                    (pHasCycle? ' - Length: ' + pLength.toString() : ' - X') + 
                '</li>';
        })

    $(`#${HTML_CYCLES_AREA_ID}`).html(
        '<ul>' +
            wListOfCycles +
        '</ul>'
    );
}
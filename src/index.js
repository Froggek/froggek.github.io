import $ from "jquery";
function getIntCoordinates(coordinates) {
    let splitStringCoords = coordinates.split(',');
    if (splitStringCoords.length != 2)
        throw "\"" + coordinates + "\" cannot be converted into Integer coordinates";
    return { x: parseInt(splitStringCoords[0]),
        y: parseInt(splitStringCoords[1]) };
}
function getCoordinatesFromInt(x, y) {
    return x + ',' + y;
}
function getNeighborCoordinates(coords) {
    let result = new Array();
    const cellIntCoords = getIntCoordinates(coords);
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (!((x === 0) && (y === 0)))
                result.push((cellIntCoords.x + x) + ',' + (cellIntCoords.y + y));
        }
    }
    return result;
}
function getNbOfLivingNeighbors(coords, livingCells) {
    const neighborCoords = getNeighborCoordinates(coords);
    return neighborCoords
        .filter((neighbor) => { return livingCells.has(neighbor); })
        .length;
}
function getDeadNeighbors(coords, livingCells) {
    const neighborCoords = getNeighborCoordinates(coords);
    return neighborCoords.filter((neighbor) => { return !livingCells.has(neighbor); });
}
function applyLifeRules(pLiveCells, pDeadCells) {
    pLiveCells.forEach((v, k) => {
        const deadNeighbors = getDeadNeighbors(k, pLiveCells);
        const nbOfLivingNeighbors = 8 - deadNeighbors.length;
        if ((nbOfLivingNeighbors < 2) || (nbOfLivingNeighbors > 3))
            pLiveCells.set(k, false);
        deadNeighbors.forEach((deadCellCoords) => { pDeadCells.set(deadCellCoords, false); });
    });
    pDeadCells.forEach((v, k) => {
        if (getNbOfLivingNeighbors(k, pLiveCells) === 3)
            pDeadCells.set(k, true);
    });
    pDeadCells.forEach((v, k) => {
        if (v)
            pLiveCells.set(k, true);
    });
    pDeadCells = new Map();
    for (const [k, v] of pLiveCells) {
        if (!v)
            pLiveCells.delete(k);
    }
}
function updateUI(pLiveCells, pDeadCells) {
    let tableBody = $('#game-grid-body');
    const NB_ROWS = 30;
    const SHIFT_Y = Math.floor(NB_ROWS / 2);
    const NB_COLUMNS = 30;
    const SHIFT_X = Math.floor(NB_COLUMNS / 2);
    tableBody.html('');
    for (let i = 0; i < NB_ROWS; i++) {
        let tr = '<tr>';
        for (let j = 0; j < NB_COLUMNS; j++) {
            tr += '<td '
                + (pLiveCells.has(getCoordinatesFromInt(j - SHIFT_X, i - SHIFT_Y))
                    ? 'class="dead-cell"' : '')
                + ' ></td>';
        }
        tableBody.append(tr + '</tr>');
    }
    let debug = '';
    pLiveCells.forEach((v, k) => {
        debug += k + ': ' + v + '<br/>';
    });
    debug += '=====================<br/>';
    pDeadCells.forEach((v, k) => {
        debug += k + ': ' + v + '<br/>';
    });
    $('#debug').html(debug);
}
function lifeRound(pLiveCells, pDeadCells) {
    applyLifeRules(pLiveCells, pDeadCells);
    updateUI(pLiveCells, pDeadCells);
}
let liveCells = new Map();
let deadCells = new Map();
liveCells.set('0,0', true);
liveCells.set('1,0', true);
liveCells.set('2,0', true);
updateUI(liveCells, deadCells);
let repeat = setInterval(() => { lifeRound(liveCells, deadCells); }, 1000);
//# sourceMappingURL=index.js.map
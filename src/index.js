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
let liveCells = new Map();
let deadCells = new Map();
liveCells.set('0,0', true);
liveCells.set('1,0', true);
liveCells.set('2,0', true);
liveCells.forEach((v, k) => {
    const deadNeighbors = getDeadNeighbors(k, liveCells);
    const nbOfLivingNeighbors = 8 - deadNeighbors.length;
    if ((nbOfLivingNeighbors < 2) || (nbOfLivingNeighbors > 3))
        liveCells.set(k, false);
    deadNeighbors.forEach((deadCellCoords) => { deadCells.set(deadCellCoords, false); });
});
deadCells.forEach((v, k) => {
    if (getNbOfLivingNeighbors(k, liveCells) === 3)
        deadCells.set(k, true);
});
deadCells.forEach((v, k) => {
    if (v)
        liveCells.set(k, true);
});
deadCells = new Map();
for (const [k, v] of liveCells) {
    if (!v)
        liveCells.delete(k);
}
let tableBody = $('#game-grid-body');
for (let i = 0; i < 30; i++) {
    let tr = '<tr>';
    for (let j = 0; j < 30; j++) {
        tr += '<td></td>';
    }
    tableBody.append(tr + '</tr>');
}
let debug = '';
liveCells.forEach((v, k) => {
    debug += k + ': ' + v + '<br/>';
});
debug += '=====================<br/>';
deadCells.forEach((v, k) => {
    debug += k + ': ' + v + '<br/>';
});
$('#debug').html(debug);
//# sourceMappingURL=index.js.map
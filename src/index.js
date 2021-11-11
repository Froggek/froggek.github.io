import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { clickOnGridListener, clickOnStartListener, updateUI } from './grid-ui';
function getIntCoordinates(coordinates) {
    let splitStringCoords = coordinates.split(',');
    if (splitStringCoords.length != 2)
        throw "\"" + coordinates + "\" cannot be converted into Integer coordinates";
    return { x: parseInt(splitStringCoords[0]),
        y: parseInt(splitStringCoords[1]) };
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
    pDeadCells.clear();
    for (const [k, v] of pLiveCells) {
        if (!v)
            pLiveCells.delete(k);
    }
}
function lifeRound(pLiveCells, pDeadCells) {
    applyLifeRules(pLiveCells, pDeadCells);
    updateUI(pLiveCells, pDeadCells);
}
let liveCells = new Map();
let deadCells = new Map();
let UIComponents = {};
updateUI(liveCells, deadCells);
clickOnGridListener(liveCells, document);
clickOnStartListener(liveCells, deadCells, lifeRound, UIComponents);
//# sourceMappingURL=index.js.map
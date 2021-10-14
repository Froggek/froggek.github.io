import * as $ from "./jquery-3.6.0.min.js";  


const bonds = [ /* min = */ [0, 0, ], /*max = */[0,0]]; 

let grid = []; 

function init(grid, init_cells) {
    return null; 
}

for (let i = 0; i < 50; i++) {
    let row = ""; 

    for (let j = 0; j < 50; j++) {
        row += '<td>' + /* i + ' . ' + j + */ '</td>';     
    }

    $('#game-grid > tbody').append('<tr>' + row + '</tr>'); 
}
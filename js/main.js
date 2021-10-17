"use strict";
exports.__esModule = true;
var $ = require("./jquery-3.6.0.min.js");
var bonds = [/* min = */ [0, 0,], /*max = */ [0, 0]];
var grid = [];
function init(grid, init_cells) {
    return null;
}
for (var i = 0; i < 50; i++) {
    var row = "";
    for (var j = 0; j < 50; j++) {
        row += '<td>' + /* i + ' . ' + j + */ '</td>';
    }
    $('#game-grid > tbody').append('<tr>' + row + '</tr>');
}

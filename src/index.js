import $ from "jquery";
let tableBody = $('#game-grid-body');
for (let i = 0; i < 30; i++) {
    let tr = '<tr>';
    for (let j = 0; j < 30; j++) {
        tr += '<td></td>';
    }
    tableBody.append(tr + '</tr>');
}
//# sourceMappingURL=index.js.map
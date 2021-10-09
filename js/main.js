for (let i = 0; i < 20; i++) {
    let row = ""; 

    for (let j = 0; j < 20; j++) {
        row += '<td><div>'+ i + ' . ' + j + '</div></td>';     
    }

    $('#game-grid > tbody').append('<tr>' + row + '</tr>'); 
}
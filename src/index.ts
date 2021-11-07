import $ from "jquery"; 

let tableBody: JQuery<HTMLElement> = $('#game-grid-body'); 

for (let i:number = 0; i < 30; i++) {
    let tr: string = '<tr>';

    for (let j:number = 0; j < 30; j++) {
        tr += '<td></td>'; 
    }

    tableBody.append(tr + '</tr>'); 
}


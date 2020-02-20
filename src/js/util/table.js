export const removeTableRow = ($table) => {
    if ($table.rows.length > 0) {
        for (let i = $table.rows.length - 1; i > 0; i--) {
            $table.deleteRow(i);
        }
    }
};

export const addTableHeader = ($table, headerTexts) => {

    if ($table.rows.length < 1) {
        let headerRow = document.createElement('tr');

        for (let i = 0; i < headerTexts.length; i++) {
            let th = document.createElement('th');
            let thText = document.createTextNode(headerTexts[i]);
            th.appendChild(thText);
            headerRow.appendChild(th);
        }

        $table.appendChild(headerRow);
    }
};

export const addTableRow = ($table, rows) => {

    if (rows.length > 0) {
        let newRow = document.createElement('tr');

        for (let i = 0; i < rows.length; i++) {
            let td = document.createElement('td');
            let tdText = document.createTextNode(rows[i]);
            td.appendChild(tdText);
            newRow.appendChild(td);
        }

        $table.appendChild(newRow);
    }
};

export const addRadio = ($table, $form) => {
    for (let i = 1; i < $table.rows.length; i++) {
        let td = document.createElement('td');
        let radio = document.createElement("input");
        radio.type = 'radio';
        radio.name = 'radioTd';
        radio.value = $table.rows[i].cells[0].innerHTML;
        $form.appendChild(radio);
        td.appendChild(radio);
        $table.rows[i].appendChild(td);
    }
};
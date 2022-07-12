
/**
 * The method takes a configuration object and a data object and
 * based on them creates an HTML table and
 * fills in its data
 * @param config settings
 * @param data data
 */
function createTable(config, data = undefined) {

    data = dataPreparation(data);

    columnManager(config, data)


    // ************ //
    // CREATE TABLE //
    // ************ //
    let parent = document.querySelector(config.parent);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    let table = document.createElement('TABLE')

    // Create Table Head
    let thead = document.createElement('THEAD')
    let tr = document.createElement('TR')

    for (let i = 0; i < config.columns.length; i++) {
        let th = document.createElement('TH')
        th.appendChild(document.createTextNode(config.columns[i].title))
        tr.appendChild(th)
    }

    thead.appendChild(tr)
    table.appendChild(thead)
    thead = null;

    // Create Table Body
    let tbody = document.createElement('TBODY')

    // Fill the columns with the received data
    let number = 1; // for line numbering

    // Save the last ID in the database on the server
    config.lastIDinBD = +(Object.keys(data)[Object.keys(data).length - 1]);

    for (let key in data) {
        tr = document.createElement('TR')

        // Fill column number if it is
        if (config.numberLines) {
            let td = document.createElement('TD')
            td.appendChild(document.createTextNode('' + (number++)))
            tr.appendChild(td)
        }

        let birthDate = 0;

        // Loop fill fields
        for (let i = config.numberLines ? 1 : 0; i < config.columns.length; i++) {

            let td = document.createElement('TD')

            // Create IMAGE-avatar
            if (config.columns[i].value.toLowerCase() === 'avatar') {
                // let box_img = document.createElement('DIV');
                // let image = document.createElement('IMG');
                // image.src = data[key][config.columns[i].value] ? data[key][config.columns[i].value] : '';
                // image.classList.add('avatar')
                // box_img.appendChild(image)
                // td.appendChild(box_img)
            }

            // Create field BIRTHDAY
            else if (config.columns[i].value.toLowerCase() === 'birthday') {

                if (data[key][config.columns[i].value]) {
                    birthDate = new Date(data[key][config.columns[i].value]);

                    td.appendChild(document.createTextNode(
                        `${birthDate.getDate()} `
                        + `${getMonthWords(birthDate.getMonth())} `
                        + `${birthDate.getFullYear()}`
                    ));

                } else {
                    td.appendChild(document.createTextNode(''));
                }
            }

            // Create field AGE
            else if (config.columns[i].value.toLowerCase() === 'age') {

                // Calculating-age-by-date-of-birth
                if (birthDate) {
                    // https://ru.stackoverflow.com/questions/576478/javascript-%D0%92%D1%8B%D1%87%D0%B8%D1%81%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B2%D0%BE%D0%B7%D1%80%D0%B0%D1%81%D1%82%D0%B0-%D0%BF%D0%BE-%D0%B4%D0%B0%D1%82%D0%B5-%D1%80%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F
                    let today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    let m = today.getMonth() - birthDate.getMonth();
                    let d = today.getDay() - birthDate.getDay();

                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    if (age === 0) {
                        m = 12 + m;
                        if (d < 0 || (d === 0 && today.getDate() < birthDate.getDate())) {
                            m--;
                        }
                    }

                    td.appendChild(document.createTextNode(`${age ? age + ' г' : m + ' м'}`));
                }
                td.appendChild(document.createTextNode(''));
            }

            // Create a Delete Button for Each Row of Element
            else if (config.columns[i].value.toLowerCase() === config.columnButtonsValue.toLowerCase()) {
                let buttonRemoveElement = document.createElement('BUTTON');
                buttonRemoveElement.id = config.buttonDeletePrefixID + key;
                buttonRemoveElement.classList.add(config.buttonDeleteClass)
                buttonRemoveElement.appendChild(document.createTextNode(config.buttonDeleteName));
                buttonRemoveElement.addEventListener('click', deleteUser(config));
                td.appendChild(buttonRemoveElement);
            }

            // Create ID fields
            else if (config.columns[i].value.toLowerCase() === 'id'){
                td.appendChild(document.createTextNode(key))
            }

            // Create ALL fields
            else {
                td.appendChild(document.createTextNode(
                    data[key][config.columns[i].value] ? data[key][config.columns[i].value] : ''))
            }

            tr.appendChild(td)
        }

        tbody.appendChild(tr)
    }

    table.appendChild(tbody)
    document.querySelector(config.parent).appendChild(table)

    createButtons(config);
}

/**
 * Delete element
 */
function deleteUser(config) {
    return function () {

        const self = this;

        let id = self.attributes.id.value.substr(config.buttonDeletePrefixID.length);

        // info elem deleting
        let sibling = self.parentNode.parentNode.firstChild;
        const a = [];

        while (sibling) {
            if(sibling.textContent !== config.buttonDeleteName) {
                a.push(sibling.textContent)
            }
            sibling = sibling.nextSibling
        }

        let text = ''
        for (let i = 0; i < a.length; i++) {
            text += `    ${config.columns[i].title} :  ${a[i]}\n`;
        } // end info for elem deleting

        if (!confirm('\nУдалить данные?\n\n' + text)) {
            return;
        }

        fetch(config.apiUrl + '/' + id   , {
            method: 'DELETE',
        })
            .then(res => res.json()) // or res.json()
            .then(() => {
                getFetchCreateTable(config.apiUrl, config);
            })
    }
}

/**
 * Function to handle pressing the Enter button.
 * An attempt was made to send data to the server.
 * + Refresh data from server
 * @param config General configuration
 * @returns {(function(*): void)|*} callback
 */
function pressEnterEvent(config) {
    return function (e) {
        if (e.key === 'Enter') {

            // Check. If not all fields are filled in
            let checkList = config.inputs.reduce((arr, item) => {

                for (let j = 0; j < item.childNodes.length; j++) {

                    if (item.childNodes[j].firstChild) {

                        let ch = item.childNodes[j].firstChild;

                        if (ch.hasAttribute('required') && !ch.value) {
                            arr.push(ch);
                        }
                    }
                }

                return arr;
            }, []);

            // If not all fields are filled in
            if (checkList.length > 0) {
                let items = '';
                checkList.forEach(item => {
                    item.classList.add('required_fill');
                    item.classList.remove('focus_input');
                    items += item.getAttribute('name') + ', ';
                })
                alert(`Заполните пожалуйста поле(-я):\n${items.substring(0, items.length - 2)}!`);

                // If all fields are filled
            } else {

                let result = config.inputs.reduce((collection, item) => {

                    for (let j = 0; j < item.childNodes.length; j++) {

                        if (item.childNodes[j].firstChild) {

                            let ch = item.childNodes[j].firstChild;

                            if (ch.hasAttribute('type')) {
                                collection[ch.name] =
                                    ch.name.toLowerCase() === 'id' ?
                                        -1 : ch.value;
                            }
                        }
                    }

                    return collection;
                }, {})

                console.log('res data: ', result);

                // ADD ELEMENTS
                fetch(config.apiUrl, {
                    method: 'POST',
                    body: JSON.stringify(result),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        console.log('-response - ', response)
                    })
                    .then(() => {
                        getFetchCreateTable(config.apiUrl, config)
                    })
                    .catch(error => {
                        console.log(error)
                    });
            }
        }
    }
}

/**
 * Function of pressing a button to cancel data entry
 * @returns {(function(*): void)|*} callback
 */
function clickCancelButton(config) {

    return (e) => {
        document.getElementById(config.buttonAddLineID).value = 0;

        config.inputs = config.inputs.filter(item => {
            return item !== e.path[2];
        });

        e.path[2].remove();
    };
}

/**
 * Events that occur when data is entered into the input field
 * @returns {(function(*): void)|*}
 */
function inputEnterEvent() {
    return (e) => {
        if (e.path[0].value === '') {
            e.path[0].classList.remove('focus_input');
            e.path[0].classList.add('required_fill');
        } else {
            e.path[0].classList.remove('required_fill');
            e.path[0].classList.add('focus_input');
        }

    };
}

/**
 *  CREATE BUTTONS (ADD RECORD ROW, CANCEL ROW)
 *
 *
 */
function createButtons(config) {
    if (document.getElementById(config.buttonAddLineID)) {
        return;
    }

    const parent = document.querySelector(config.parent);
    const buttonAddElement = document.createElement('BUTTON');
    buttonAddElement.value = 0;
    buttonAddElement.appendChild(document.createTextNode(config.buttonAddLineName))
    buttonAddElement.id = config.buttonAddLineID;

    buttonAddElement.onclick = (e) => {

        // Count number click button
        let countPressButton = Number(e.path[0].value) + 1;
        e.path[0].value = countPressButton;

        if (e.path[0].value >= 2) return;

        let form = document.createElement('FORM');
        form.id = config.formID;
        form.setAttribute('action', config.apiUrl)
        form.setAttribute('method', 'POST')
        parent.appendChild(form)

        const tbody = parent.querySelector('tbody');
        let tr = document.createElement('TR')
        tr.id = 'row-' + countPressButton + '-element_input';

        for (let i = 0; i < config.columns.length; i++) {
            let td = document.createElement('TD')

            if (config.noEditColumns.includes(config.columns[i].value)) {


                // ADDING A CANCEL BUTTON
                if (config.columns[i].value === 'deleteRow') {
                    let button = document.createElement('BUTTON');
                    button.appendChild(document.createTextNode('X'));

                    button.addEventListener('click', clickCancelButton(config));

                    td.appendChild(button);

                } else {
                    td.appendChild(document.createTextNode(''));
                }


                // Add INPUT FIELDS
            } else {

                let input = document.createElement('INPUT');
                input.type = 'text';
                input.setAttribute('required', 'required');
                input.name = config.columns[i].value;
                input.id = 'row-' + countPressButton + '-' + config.columns[i].value;
                input.setAttribute('form', config.formID);
                input.placeholder = config.columns[i].title;
                input.classList.add('focus_input');

                if (config.columns[i].value.toLowerCase() === 'id') {
                    input.style.display = 'none';
                    input.removeAttribute('required');
                    input.value = 0;
                }

                if (config.inputTypeDate.includes(config.columns[i].value)) {
                    input.type = 'date';
                }

                // INPUT data EVENT
                input.addEventListener('input', inputEnterEvent());

                // PRESS ENTER EVENT
                input.addEventListener('keyup', pressEnterEvent(config), null);

                td.appendChild(input)
            }

            tr.appendChild(td)
        }

        tbody.insertBefore(tr, tbody.firstChild);

        // Add to List INPUT FIELDS
        config.inputs = [...config.inputs, tr];
    };


    // Insert the new element before the first child
    parent.insertBefore(buttonAddElement, parent.firstChild);
}

/**
 * Default + Custom Settings
 * @param config
 * @returns {*&{formID: string, buttonAddLineName: string, parent: string, buttonDeleteClass: string, inputTypeDate: string[], columnButtonsName: string, inputs: *[], columns: null, noEditColumns: string[], buttonDeleteName: string, buttonDeletePrefixID: string, numberView: string, apiUrl: null, columnButtonsValue: string, buttonAddLineID: string, numberLines: boolean, lastIDinBD: null, jsonStructure: null, autoColumns: boolean}}
 */
function configSetting(config) {
    let defaultConfig = {
        buttonDeleteName: 'Удалить',
        buttonDeletePrefixID: 'tableElement-',
        buttonDeleteClass: 'button_remove',

        buttonAddLineName: 'Добавить новую запись',
        buttonAddLineID: 'add_new_record',

        columnButtonsName: 'Действия',
        columnButtonsValue: 'deleteRow',

        showIDColumn: false,
        formID: 'form_creating_new_element',
        inputs: [],
        inputTypeDate: ["birthday"],

        parent: '#alex-data-table',
        lastIDinBD: null,
        numberLines: true,
        numberView: '№',
        autoColumns: true,
        noEditColumns: ['deleteRow'], // Can't edit cell with button to delete rows
        columns: null,
        jsonStructure: null,
        apiUrl: null,
    }

    // Rewrite array
    if (config.noEditColumns) {
        config.noEditColumns = [...config.noEditColumns, ...defaultConfig.noEditColumns]
    }
    if (config.inputTypeDate) {
        config.inputTypeDate = [...config.inputTypeDate, ...defaultConfig.inputTypeDate]
    }

    // Rewrite config
    return {...defaultConfig, ...config};
}

function isHtmlObject(config) {
    // is object parent HTML
    if (!document.querySelector(config.parent)) {
        console.log(`Объект HTML с id: ${config.parent}, не найден`)
        return false;
    }
    return true;
}

function dataPreparation(data) {
    // data preparation
    if (Object.keys(data).length === 1 && typeof data[Object.keys(data)[0]] === 'object') {
        data = data[Object.keys(data)[0]];
    }

    if (Array.isArray(data)) {
        data = {...data}
    }

    return data;
}

/**
 * COLUMNS MANAGER
 *
 * @param config
 * @param data
 */
function columnManager(config, data) {

    if (config.autoColumns) {

        config.columns = [];

        // write unique keys to collection
        let setColumns = new Set();
        for (let key in data) {
            for (let k in data[key]) {
                setColumns.add(k)
            }
        }
        // create a list of fields and write to the configuration
        for (let col of setColumns) {
            if (col.toLowerCase() === 'id' && !config.showIDColumn) {
                continue;
            }
            config.columns.push({title: col, value: col, auto: true,});
        }
    }

    // Add a column to insert line numbering
    if (config.numberLines) {
        config.columns = [{title: config.numberView, value: null, auto: false,}, ...config.columns];
    }

    // Add column for row delete buttonAddElement
    config.columns.push({title: config.columnButtonsName, value: config.columnButtonsValue, auto: false,});
}

/**
 * The method combines settings, takes data depending on the settings.
 * And builds the HTML table (by calling the createTable () helper function).
 * @param config config settings. If there are no settings, the function substitutes the default settings.
 * @param data data to display. If there is no transmitted data, the function sends a request to the server
 *              at the address specified in the settings (apiUrl).
 * @constructor none
 */
function DataTable(config = undefined, data = undefined) {
    if (data === undefined && !config.apiUrl) {
        return;
    }

    config = configSetting(config);

    if (!isHtmlObject(config)) {
        return;
    }

    // REQUEST
    if (data === undefined) {
        let url = config.apiUrl;

        if (url) {

            getFetchCreateTable(url, config);

        } else {
            return;
        }

        return;
    }

    createTable(config, data)
}

/**
 *
 * @param url
 * @param config
 */
function getFetchCreateTable(url, config) {
    fetch(url, {
        'cache-control': "no-cache",
        'cache': "no-store",
    })
        .then(response => {
            return response.json();
        })
        .then(res => {
            console.log('res: ', res);
            createTable(config, res.valueOf());
        })
}

/**
 * The method takes the day of the month and returns the month as a Russian word.
 * @param numMonth month number from 0 to 11
 * @returns {string} month name in Russian.
 */
function getMonthWords(numMonth) {
    switch (numMonth) {
        case 0:
            return 'января';
        case 1:
            return 'февраля';
        case 2:
            return 'марта';
        case 3:
            return 'апреля';
        case 4:
            return 'майя';
        case 5:
            return 'июня';
        case 6:
            return 'июля';
        case 7:
            return 'августа';
        case 8:
            return 'сентября';
        case 9:
            return 'октября';
        case 10:
            return 'ноября';
        case 11:
            return 'декабря';
        default:
            return '';
    }
}

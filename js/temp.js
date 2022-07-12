function DataTable(config, data = undefined) {
    // содержимое этой функции вам и нужно написать :)

    let table = document.createElement('TABLE')
    let fields = []

    // Create Table Head
    let thead = document.createElement('THEAD')
    let trHead = document.createElement('TR')

    // Create field for number if it is
    if (config.numberLines) {
        let th = document.createElement('TH')
        th.appendChild(document.createTextNode(config.numberView))
        trHead.appendChild(th)
        fields.push(config.numberView)
    }

    // Create fields as config
    for (let i = 0; i < config.columns.length; i++) {
        let th = document.createElement('TH')
        th.appendChild(document.createTextNode(config.columns[i].title))
        trHead.appendChild(th)
        fields.push(config.columns[i].value)
    }

    thead.appendChild(trHead)
    table.appendChild(thead)

    // Create Table Body
    let tbody = document.createElement('TBODY')
    let number = 1; // for line numbering

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

    // Fill fields as within of array
    for (const key in data) {
        // if (++number === 10) break; // todo: only a few entries
        let tr = document.createElement('TR')

        // Fill column number if it is
        if (config.number) {
            let td = document.createElement('TD')
            td.appendChild(document.createTextNode(number++))
            tr.appendChild(td)
        }

        let birthDate;

        // Loop fill fields
        for (let i = config.number ? 1 : 0; i < fields.length; i++) {

            let td = document.createElement('TD')

            // Create IMAGE-avatar
            if (fields[i] === 'avatar') {

                let box_img = document.createElement('DIV');
                let image = document.createElement('IMG');
                image.src = data[key][fields[i]] ? data[key][fields[i]] : '';
                image.classList.add('avatar')
                box_img.appendChild(image)
                td.appendChild(box_img)
            }

            // Create field BIRTHDAY
            else if (fields[i] === 'birthday') {

                birthDate = new Date(data[key][fields[i]] ? data[key][fields[i]] : '');

                td.appendChild(
                    document.createTextNode(
                        `${birthDate.getDate()} `
                        + `${getMonthWords(birthDate.getMonth())} `
                        + `${birthDate.getFullYear()}`
                    ));

            }

            // Create field AGE
            else if (fields[i] === 'age') {

                // Calculating-age-by-date-of-birth
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

            // Create ALL fields
            else {
                td.appendChild(document.createTextNode(
                    data[key][fields[i]] ? data[key][fields[i]] : ''))
            }

            tr.appendChild(td)
        }

        tbody.appendChild(tr)
    }
    table.appendChild(tbody)
    document.querySelector(config.parent).appendChild(table)

}
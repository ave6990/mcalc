/** 
* @description This is user interface lib for create the html docs.
* @version 0.1.0
* @author ave6990
*/

/** @description Container create a namespace of the library. */
const ui = {}

/**
* @description This function create a html table and fill it with the input data.
* @param {Object.<string, sting | number>} data - Input data.
* @param {Object.<string, string>} fields - Data fields that need insert in the table.
* @return {string} table - html code that represent the data table.
*/
ui.jsonToTable = (data, options = {}) => {
//ui.jsonToTable = (data, fields, table_id, header = true, vertical = false) => {
    const fragment = document.createDocumentFragment()

    if (data.length <= 0) {
        return fragment
    }

    if (!options.id) {
        options.id = new Date()
    }

    if (!options.caption) {
        options.caption = `Table - ${options.id}`
    }

    const caption = document.createElement('caption')
    caption.innerHTML = options.caption

    /** @debug Don't work. Элементы data не всегда имеют одинаковый набор свойств.*/
    if (!options.fields) {
        options.fields = Object.keys(data[0]).reduce( (obj = {}, field) => {
            obj[field] = field
        } )
    }

    const table = document.createElement('table')
    table.id = options.id
    table.appendChild(caption)
    const tbody = document.createElement('tbody')

    if (options.vertical) {
        for (const [i, field] of Object.keys(options.fields).entries()) {
            const tr = document.createElement('tr')

            for (const [j, record] of data.entries()) {
                let td = undefined
                if (options.header && j == 0) {
                    td = document.createElement('th')
                    td.abbr = field
                    td.innerHTML = options.fields[field]
                } else {
                    td = document.createElement('td')
                    const val = _getVal(record[field])
                    td.id = `${options.id}_${i}_${j}`
                    td.innerHTML = val
                }
                tr.appendChild(td)
            }
            
            tbody.appendChild(tr)
        }
    } else {
        if (options.header) {
            const thead = document.createElement('thead')
            const tr = document.createElement('tr')
            tr.id = `${options.id}_row_header`

            for (const field of Object.keys(options.fields)) {
                const th = document.createElement('th')
                th.abbr = field
                th.innerHTML = options.fields[field]
                tr.appendChild(th)
            }

            thead.appendChild(tr)
            table.appendChild(thead)
        }


        for (const [i, record] of data.entries()) {
            const tr = document.createElement('tr')
            tr.id = `${options.id}_row_${i}`

            for (const [j, field] of Object.keys(options.fields).entries()) {
                const td = document.createElement('td')
                td.id = `${options.id}_${i}_${j}`
                const val = _getVal(record[field])
                td.innerHTML = val
                tr.appendChild(td)
            }

            tbody.appendChild(tr)
        }
    }

    table.appendChild(tbody)
    table.addEventListener('click', _selectRow)
    
    if (options.event_listener) {
        table.addEventListener('click', options.event_listener)
    }

    fragment.appendChild(table)

    return fragment
}

const _getVal = (val) => {
    if (val == undefined || val == null) {
        return ''
    }
    return val
}

/* Обработчик события.
 * Присваивает строке таблицы класс `selected_row`.
 */
const _selectRow = (event) => {
    const tag = event.target.tagName.toLowerCase()
    const tr = event.target.parentElement
    
    /** При повторном выборе строки, класс `selected_row` удаляется. */
    for (const elem of document.getElementsByClassName('selected_row')) {
        if (elem.id != tr.id) {
            elem.classList.toggle('selected_row')
        }
    }

    /** Select the row. */
    if (tag == 'td') {
        tr.classList.toggle('selected_row')
    }
}

/** @debug Переписать без JQuery */
ui.editableCells = (table_id) => {
	$(`#${table_id} td`).click( (e) => {
		const t = e.target || e.srcElement
		const el_name = t.tagName.toLowerCase()

		if (el_name == 'input') {
			return false
		}

		const val = $(t).html()
		$(t).empty().append(`<input type='text' id='edit', value='${val}' />`)
		$('#edit').focus()
		$('#edit').blur( () => {
			const new_val = $('#edit').val()
			$(t).empty().html(new_val)
		} )
	} )
}

/** @debug Delete this code from production. */
console.log(
    ui.jsonToTable([
        {
            a: 1,
            b: 2,
        },
        {
            a: 3,
            b: 4,
        },
    ], 
    {
        fields: {
            a: 'first',
            b: 'second',
        },
        id: 'data',
        header: true,
        vertical: true,
    }).innerHTML
)

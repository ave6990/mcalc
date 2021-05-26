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
    let rows = ''
	let thead = ''
	let tbody = ''

    if (data.length <= 0) {
        return undefined
    }

    /** @debug Don't work. Object.keys ?*/
    if (!options.fields) {
        options.fields = Object.keys(data[0]).reduce( (obj = {}, field) => {
            obj[field] = field
        } )
    }

    if (!options.id) {
        options.id = new Date()
    }

    if (options.vertical) {
        for (const [i, field] of Object.keys(options.fields).entries()) { 
            let cols = ''
            for (const [j, record] of data.entries()) {
                if (options.header && j == 0) {
                    cols = `${cols}\n\t<th abbr=${field}>${options.fields[field]}</th>`
                } 

                //let val = record[field] || ''
                let val = _getVal(record[field])

                cols = `${cols}\n\t<td id='${options.id}_${i}_${j}'>${val}</td>`
            }
            rows = `${rows}\n<tr id='${options.id}_row_${i}'>${cols}\n</tr>`
        }
    } else {
        if (options.header) {
            for (const field of Object.keys(options.fields)) {
                rows = `${rows}\n<th abbr=${field}>${options.fields[field]}</th>`
            }
            thead = `<thead>\n<tr id='${options.id}_header'>${rows}\n</tr>\n</thead>`
            rows = ''
        }
        for (const [i, record] of data.entries()){
            let cols = ''
            for (const [j, field] of Object.keys(options.fields).entries()) {
                //let val = record[field] || ''
                let val = _getVal(record[field])
                cols = `${cols}\n<td id='${options.id}_${i}_${j}'>${val}</td>`
            }
            rows = `${rows}\n<tr id='${options.id}_row_${i}'>${cols}\n</tr>`
        }
    }

    if (!options.caption) {
        options.caption = `Table - ${options.id}`
    }

    const caption = `<caption>${options.caption}</caption>`
	const table = `<table id='${options.id}'>\n${caption}\n${thead}\n<tbody>${rows}\n</tbody>\n</table>`
	return table
}

const _getVal = (val) => {
    if (val == undefined || val == null) {
        return ''
    }
    return val
}

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
    })
)

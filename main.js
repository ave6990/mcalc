/** Called after application is started. */
let measurements = {}
let device = {}

/** Read the value from a text input fields. */
const getVal = (id, func) => {
    const res = document.getElementById(id).value   
    if (func) {
        return func(res)
    }

    return res
}

/** Select a contant of text fields. */
for (const element of document.getElementsByTagName('input')) {
    element.addEventListener('click', (event) => {
        event.target.select()
    })
}


const mi_info_fields = ['date', 'count_number', 'mi_type', 
    'mi_registry_number', 'mi_manufacture_year', 'mi_number']

/** Event of change the input fields. */
for (const id of mi_info_fields) {
    document.getElementById(id).addEventListener('click', (event) => {
        device.setData( () => {
            const mi_info = {}

            for (const field of mi_info_fields) {
                if (field == 'date') {
                    mi_info[field] = mDate.toDate(document.getElementById(field).value, true)
                } else {
                    mi_info[field] = document.getElementById(field).value
                }
            }
            return mi_info
        } )
    } )
}


const OnStart = () => {
    document.getElementById('measurements').style.display = 'none'
    app.SetOrientation('Portrait')
    measurements = new Measurements()
}

document.getElementById('btn_add_mi').addEventListener('click', (event) => {
    document.getElementById('measurements').style.display = ''
    document.getElementById('main').style.display = 'none'
    document.getElementById('date').value = mDate.toDOMString(new Date())
    device = new Device({date: new Date()})
} )

document.getElementById('btn_main').addEventListener('click', (event) => {
    document.getElementById('measurements').style.display = 'none'
    document.getElementById('main').style.display = ''
} )

document.getElementById('btn_save_mi').addEventListener('click', (event) => {
    app.ShowPopup('Данные СИ сохранены')
} )

const measure = () => {
    if (getVal('measured_value')) {
        return {
            channel: getVal('channel'),
            m_value: getVal('measured_value', Number),
            ref_value: getVal('ref_value', Number),
            range: getVal('range'),
        }
    }

    return undefined
}

$('#btn_add_measure').click( () => {
    const in_data = measure()
    const channel = document.getElementById('channel').value
    const fields = {
        ref_value: 'Xref',
        m_value: 'Xi',
        range: 'R',
        abs_error: 'Δ',
        rel_error: 'δ, %',
        red_error: 'γ, %',
    }

    if (in_data) {
        device.addMeasurement(in_data)
        document.getElementById('measurements_results').innerHTML = ''
        
        document.getElementById('measurements_results').innerHTML +=
            ui.jsonToTable(device.measurements, fields, `table_mes`, true)
    }
})

$('#test').click( () => {
    const test_data = {
        mi_type: 'АМ-5',
        mi_registry_number: '10719-07',
        mi_number: 241821,
        mi_manufacture_year: 2017,
        range: '0-100',
        measured_value: 101.5,
        ref_value: 100,
    }
    
    for (const key of Object.keys(test_data)) {
        document.getElementById(key).value = test_data[key]
    }
})

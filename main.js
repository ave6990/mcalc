/** Called after application is started. */
let measurements = {}
let device = {}

/** Read the value from a text input fields. */
const getVal = (id, func) => {
    const res = document.getElementById(id).value   
    if (res) {
        if (func) {
            return func(res)
        }
        return res
    } else {
        return undefined
    }
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

    if (in_data) {
        device.addMeasurement(in_data)
        showMeasurements(device)
    }

})

const showMeasurements = (device) => {
    const fields = {
        id: '#',
        ref_value: 'X_ref',
        m_value: 'X_i',
        range: 'R',
        abs_error: 'Δ',
        rel_error: 'δ, %',
        red_error: 'γ, %',
    }

    const fields_stat = {
        ref_value: 'X_ref',
        average_value: 'X_i_cp',
        range: 'R',
        abs_error: 'Δ_cp',
        rel_error: 'δ_cp, %',
        red_error: 'γ_cp, %',
        sko: 'СКО',
    }
    let m_results = document.getElementById('measurements_results')

    m_results.innerHTML = ''

    device.getUnique('channel').map( (channel) => {
        m_results.innerHTML +=
            ui.jsonToTable(device.getMeasurements(channel), {
                id: channel,
                caption: `Канал - ${channel}`,
                header: true,
                fields: fields,
            } )

        //document.getElementById('measurements_results').innerHTML +=
        m_results.innerHTML +=
            ui.jsonToTable(device.getStatistic(channel), {
                id: `stat_${channel}`,
                caption: `Статистические показатели`,
                header: true,
                fields: fields_stat,
            } )
        
        m_results.innerHTML += '<hr></hr>'
    } )


    document.getElementById('measurement_number').innerHTML = device.m_id
}
 
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

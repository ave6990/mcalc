/** Called after application is started. */
let measurements = {}
let device = {}
const state = {
    page: 1,
    sort: '',
    filter: undefined,
    pages: 10,
    pages_count: 1,
    total_count: 0,
}

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

const toDevicePage = () => {
    document.getElementById('measurements').style.display = ''
    document.getElementById('measurements_results').innerHTML = ''
    document.getElementById('main').style.display = 'none'
}

const toMainPage = () => {
    document.getElementById('measurements').style.display = 'none'
    document.getElementById('main').style.display = ''
}

const OnStart = () => {
    document.getElementById('measurements').style.display = 'none'
    document.getElementById('delete_dialog').style.display = 'none'
    document.getElementById('filter').style.display = 'none'
    document.getElementById('page_number').value = `${state.page} из ${state.pages_count}`
    app.SetOrientation('Portrait')
    measurements = new Measurements()
    showDevices()
    tableEventListener()
}

document.getElementById('btn_add_mi').addEventListener('click', (event) => {
    toDevicePage()
    if (device.id) {
        device = new Device(device)
        device.id = measurements.genDeviceID()
        readDevice()
    } else {
        device = new Device({id: measurements.genDeviceID()})
        document.getElementById('date').value = mDate.toDOMString(new Date())
    }
    showMeasurements(device)
    tableEventListener()
} )

document.getElementById('btn_edit_mi').addEventListener('click', (event) => {
    toDevicePage()
    if (device.id) {
        readDevice()
        showMeasurements(device)
        tableEventListener()
    }
} )

const showPageNumber = () => {
    document.getElementById('page_number').value = `${state.page} из ${state.pages_count}`
}

document.getElementById('btn_prev').addEventListener('click', (event) => {
    const tb_page = document.getElementById('page_number')
    if (state.page > 1) {
        state.page--
    }
    showDevices()
} )

document.getElementById('btn_next').addEventListener('click', (event) => {
    const tb_page = document.getElementById('page_number')
    if (state.page < state.pages_count) {
        state.page++
    }
    showDevices()
} )

document.getElementById('page_number').addEventListener('change', (event) => {
    const val = parseInt(event.target.value.split(' ')[0])
    if (val < 1 || isNaN(val)) {
        state.page = 1
    } else if (val > state.pages_count) {
        state.page = state.pages_count
    } else {
        state.page = val
    }

    showDevices()
} )

document.getElementById('btn_del_mi').addEventListener('click', (event) => {
    document.getElementById('delete_dialog').style.display = ''
    document.getElementById('main').style.display = 'none'
} )

document.getElementById('btn_yes_del').addEventListener('click', (event) => {
    measurements.removeDevice(device.id)
    showDevices()
    measurements.writeData()
    document.getElementById('delete_dialog').style.display = 'none'
    document.getElementById('main').style.display = ''
} )    

document.getElementById('btn_no_del').addEventListener('click', (event) => {
    document.getElementById('delete_dialog').style.display = 'none'
    document.getElementById('main').style.display = ''
} )

/**document.getElementById('btn_filter').addEventListener('click', (event) => {
    const filter_section = document.getElementById('filter')
    if (filter_section.style.display == 'none') {
        filter_section.style.display = ''
    } else {
        filter_section.style.display = 'none'
    }
} )*/

document.getElementById('btn_save_mi').addEventListener('click', (event) => {
    toMainPage()
    Object.assign(device, {
        date: document.getElementById('date').value,
        count_number: getVal('count_number'),
        mi_type: getVal('mi_type'),
        mi_registry_number: getVal('mi_registry_number'),
        mi_number: getVal('mi_number'),
        mi_manufacture_year: getVal('mi_manufacture_year'),
        mi_owner: getVal('mi_owner'),
    })

    if (measurements.getDeviceIndex(device.id) < 0) {
        measurements.addDevice(device)
    } else {
        measurements.setDevice(device) 
    }

    showDevices()
    tableEventListener()
    measurements.writeData()
} )

document.getElementById('btn_cancel_mi').addEventListener('click', (event) => {
    toMainPage()
} )

const showDevices = () => {
    const recs = document.getElementById('records')
    let data = {}

    try {
        data = measurements.getDevices((state.page - 1) * state.pages, 
            state.pages, state.sort, state.filter)
    } catch (e) {
        if (state.page > 1) {
            state.page--
            data = measurements.getDevices((state.page - 1) * state.pages, 
                state.pages, state.sort, state.filter)
        } else {
            throw e
        }
    }

    state.total_count = data.total_count
    state.pages_count = parseInt((state.total_count - 1) / state.pages) + 1
    showPageNumber()

    recs.innerHTML = ''
    if (data.records.length > 0) {
        recs.innerHTML = ui.jsonToTable(data.records, {
            id: 'devices',
            caption: 'Таблица - Результаты',
            header: true,
            fields: {
                id: 'ID',
                date: 'Дата',
                count_number: 'Счет',
                mi_type: 'Тип СИ',
                mi_registry_number: 'ГРСИ',
                mi_number: 'Зав. №',
                mi_owner: 'Собственник',
            },
        } )
        tableEventListener()
    }
}

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

document.getElementById('btn_add_measure').addEventListener('click', (event) => {
    const in_data = measure()

    if (in_data) {
        device.addMeasurement(in_data)
        showMeasurements(device)
    }
    
    tableEventListener()
})

const tableEventListener = () => {
    for (const table of document.getElementsByTagName('table')) {
        table.addEventListener('click', (event) => {
            for (const tr of document.getElementsByTagName('tr')) {
                tr.classList.remove('selected_row')
            }

            const tag = event.target.tagName.toLowerCase()
            const tr = event.target.parentElement
            const [ type, ..._ ] = tr.id.split('_')

            /** Select the row. */
            if (tag == 'td') {
                tr.classList.add('selected_row')
                const id = tr.firstElementChild.innerHTML
                
                if (type == 'ch') {
                    readMeasurement(id)
                } else if (type == 'devices') {
                    app.ShowPopup(`getDevice(${id}) tableEventListener`)
                    device = measurements.getDevice(id)
                }
            /** Sort the records. */
            } else if (tag == 'th' && type == 'devices') {
                const sort_field = event.target.getAttribute('abbr')
                state.sort = event.target.abbr
                showDevices()
            }
        })
    }
}

document.getElementById('btn_edit_measure').addEventListener('click', (event) => {
    const in_data = measure()
    const id = Number(document.getElementById('measurement_number').innerHTML)

    if (in_data) {
        device.setMeasurement(in_data, id)
        showMeasurements(device)
    }
    
    tableEventListener()
} )

document.getElementById('btn_del_measure').addEventListener('click', (event) => {
    if (device.measurements.length > 0) {
        const id = Number(document.getElementById('measurement_number').innerHTML)

        device.removeMeasurement(id)
        showMeasurements(device)
        tableEventListener()
    }
} )

/** Insert data from device model to a form fields in devices info section */
const readDevice = () => {
    fields = ['date', 'count_number', 'mi_type', 'mi_manufacture_year',
        'mi_registry_number', 'mi_number', 'mi_owner']
    
    for (const field of fields) {
        const val = device[field] || ''
        document.getElementById(field).value = val
    }
}

/** Insert measurement data to a form fields in measuement section. */
const readMeasurement = (id) => {
    const vals = device.getMeasurement(id) 
    fields = {
        channel: vals.channel,
        measured_value: vals.m_value,
        ref_value: vals.ref_value,
        range: vals.range,
    }

    document.getElementById('measurement_number').innerHTML = id
    for (const field of Object.keys(fields)) {
        document.getElementById(field).value = fields[field]
    }
}

const showMeasurements = (device) => {
    const fields = {
        id: 'id',
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
                id: `ch_${channel}`,
                caption: `Канал - ${channel}`,
                header: true,
                fields: fields,
            } )

        const stat = device.getStatistic(channel)
        if (stat.length > 0) {
            m_results.innerHTML +=
                ui.jsonToTable(stat, {
                    id: `stat_${channel}`,
                    caption: `Статистические показатели`,
                    header: true,
                    fields: fields_stat,
                } )
        }
        m_results.innerHTML += '<hr></hr>'
    } )

    document.getElementById('measurement_number').innerHTML = device.genMeasurementID()
}
 
document.getElementById('test').addEventListener('click', (event) => {
    const test_data = {
        mi_type: 'X-am2500',
        mi_registry_number: '69363-17',
        mi_number: 'ARKC-2022',
        mi_manufacture_year: 2018,
        range: '0-100',
        channel: 'H2S',
        measured_value: 51,
        ref_value: 50,
    }
    
    for (const key of Object.keys(test_data)) {
        document.getElementById(key).value = test_data[key]
    }
} )

const mi_info_fields = ['date', 'count_number', 'mi_type', 
    'mi_registry_number', 'mi_manufacture_year', 'mi_number']

/** Event of change the input fields.
 * @debug: Add validation of input data.
 */
for (const id of mi_info_fields) {
    document.getElementById(id).addEventListener('change', (event) => {

    } )
}

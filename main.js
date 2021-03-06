/** Called after application is started. */
let measurements = {}
let device = {}
let selected_measurement = false

const state = {
    page: 1,
    sort: '',
    sort_order: -1,
    filter: undefined,
    pages: 10,
    pages_count: 1,
    total_count: 0,
}

pages = ['main', 'measurements', 'delete_dialog']

/** Read the value from a text input fields. */
const getVal = (id, convert_func) => {
    const res = document.getElementById(id).value   
    if (res) {
        if (convert_func) {
            return convert_func(res)
        }
        return res
    } else {
        return undefined
    }
}

const toNumber = (val) => {
    return Number(val.replace(',', '.'))
}

const debug = (obj) => {
    let container = document.getElementById('debug')
    container.innerHTML = `${container.innerHTML}\n${obj}`
}

const clearDebug = () => {
    document.getElementById('debug').innerHTML = ''
}

for (const element of document.getElementsByTagName('input')) {
    /** Select a contant of text fields. */
    element.addEventListener('click', (event) => {
        event.target.select()
    })

    /** Валидация. Показать / скрыть информационный блок. */
    const _openDetails = (target, open) => {
        const id = target.id
        const info = document.getElementById(`info_${id}`)
        if (info) {
            info.open = open
        }
    }
    
    /** @debug показать/скрыть подсказки */
    /*element.addEventListener('focus', (event) => {
        _openDetails(event.target, true)
    } )

    element.addEventListener('blur', (event) => {
        _openDetails(event.target, false)
    } )*/
}

for (const el of document.getElementsByTagName('details')) {
    el.addEventListener('click', (event) => {
        event.preventDefault()
    } )
}

/**
 * Смена рабочего окна (видового экрана).
 * @param {String} page_id - Id html-элемента (section) содержащего видовой экран.
 */
const toPage = (page_id) => {
    const cur_page = document.getElementById(page_id)

    /** @fixed_bug При нажатии кнопки удаления экран становился чистым,
     * потому что класс `hidden` не удалялся с диалога удаления в `onStart()`. */
    if (cur_page.classList.contains('hidden')) {
        cur_page.classList.remove('hidden')
    }

    for (const page of pages) {
        if (page == page_id) {
            document.getElementById(page).style.display = ''
        } else {
            document.getElementById(page).style.display = 'none'
        }
    }
}

const OnStart = () => {
    document.getElementById('filter').style.display = 'none'
    toPage('main')
    document.getElementById('page_number').value = `${state.page} из ${state.pages_count}`
    app.SetOrientation('Portrait')
    measurements = new Measurements()
    showDevices()

    for (const section of document.getElementsByClassName('hidden')) {
        section.classList.remove('hidden')
    }
}

document.getElementById('btn_add_mi').addEventListener('click', (event) => {
    if (device.id) {
        device = new Device(device)
        device.id = measurements.genDeviceID()
    } else {
        device = new Device({id: measurements.genDeviceID()})
        document.getElementById('date').value = mDate.toDOMString(new Date())
    }
    readDevice()
    toPage('measurements')
    showMeasurements(device)
} )

document.getElementById('btn_edit_mi').addEventListener('click', (event) => {
    if (device.id) {
        toPage('measurements')
        readDevice()
        showMeasurements(device)
    }
} )

document.getElementById('btn_del_mi').addEventListener('click', (event) => {
    if (device.id) {
        deleteDialog(() => {
                measurements.removeDevice(device.id)
                showDevices()
                measurements.writeData()
            },
            'main'
        )
    }
} )    

/** Навигация по страницам таблицы результатов. */
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

/**
 * Диалог удаления записей.
 * @param {Function} yesEventListener - Функция обработки события нажатия кнопки "Да".
 * @param {String} view - Id видового экрана (section id).
 */
const deleteDialog = (yesEventListener, view) => {
    toPage('delete_dialog')
    //const dialog = document.getElementById('delete_dialog')
    //dialog.show()
    document.getElementById('btn_yes_del').onclick = () => {
        yesEventListener()
        toPage(view)
        //dialog.close()
    }
    document.getElementById('btn_no_del').onclick = () => {
        document.getElementById('btn_yes_del').onclick = () => {}
        toPage(view)
        //dialog.close()
    }
}

document.getElementById('btn_filter').addEventListener('click', (event) => {
    const filter_section = document.getElementById('filter')
    if (filter_section.style.display == 'none') {
        filter_section.style.display = ''
    } else {
        filter_section.style.display = 'none'
    }
} )

document.getElementById('btn_apply_filter').addEventListener('click', (event) => {
    state.filter = {}
    const filter_fields = ['date_start', 'date_end', 'count_number', 'mi_type', 'mi_number',
        'mi_registry_number', 'mi_owner', 'verification_type', 'applicability']
    filter_fields.map( (field) => {
        state.filter[field] = getVal(`filter_${field}`)
    } )
    state.page = 1

    document.getElementById('btn_filter').click()
    showDevices()
} )

document.getElementById('btn_clear_filter').addEventListener('click', (event) => {
    state.filter = undefined
    document.getElementById('btn_filter').click()
    showDevices()
} )

document.getElementById('btn_save_mi').addEventListener('click', (event) => {
    toPage('main')
    Object.assign(device, {
        date: document.getElementById('date').value,
        count_number: getVal('count_number'),
        primary_verification: getVal('verification_type', (val) => {
            return val == 'первичная'
        } ),
        applicability: getVal('applicability', (val) => {
            if (val == 'пригодно') {
                return true
            } else if (val == 'непригодно') {
                return false
            }
            return undefined
        } ),
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
    measurements.writeData()
} )

document.getElementById('btn_cancel_mi').addEventListener('click', (event) => {
    toPage('main')
} )

const showDevices = () => {
    const recs = document.getElementById('records')
    let data = {}

    try {
        data = measurements.getDevices((state.page - 1) * state.pages, 
            state.pages, state.sort, state.sort_order, state.filter)
    } catch (e) {
        app.ShowPopup(e.stack)
        if (state.page > 1) {
            state.page--
            data = measurements.getDevices((state.page - 1) * state.pages, 
                state.pages, state.sort, state.sort_order, state.filter)
        } else {
            throw e
        }
    }

    state.total_count = data.total_count
    state.pages_count = parseInt((state.total_count - 1) / state.pages) + 1
    showPageNumber()

    recs.innerHTML = ''
    if (data.records.length > 0) {
        document.getElementById('records_count').innerHTML = data.total_count
        recs.appendChild(
            ui.jsonToTable(data.records, {
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
                    primary_verification: 'Первичная',
                    applicability: 'Пригодность',
                },
                event_listener: {
                    click: [
                        ui.event_listeners.selectableRows,
                        devicesEventListener,
                    ],
                }
            } )
        )
    }
}

const measure = () => {
    if (getVal('m_value')) {
        return {
            channel: getVal('channel'),
            m_value: getVal('m_value', toNumber),
            ref_value: getVal('ref_value', toNumber),
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
    
})

const devicesEventListener = (event) => {
    const tag = event.target.tagName.toLowerCase()
    const tr = event.target.parentElement
    
    if (tag == 'td') {
        const id = tr.firstElementChild.innerHTML
        
        if (tr.classList.contains('selected_row')) {
            device = measurements.getDevice(id)
        } else {
            device = new Device()
        }
    /** Sort the records. */
    } else if (tag == 'th') {
        const sort_field = event.target.abbr
        
        if (state.sort == sort_field) {
            state.sort_order = state.sort_order * -1
        } else {
            state.sort_order = -1
            state.sort = sort_field
        }

        showDevices()
    }
}

const measurementEventListener = (event) => {
    const tag = event.target.tagName.toLowerCase()
    const tr = event.target.parentElement
    
    if (tr.classList.contains('selected_row') && tag == 'td') {
        const id = tr.firstElementChild.innerHTML
        readMeasurement(id)
        selected_measurement = true
    } else {
        selected_measurement = false
    }
}

document.getElementById('btn_edit_measure').addEventListener('click', (event) => {
    if (selected_measurement) {
        const in_data = measure()
        const id = Number(document.getElementById('measurement_number').innerHTML)

        if (in_data) {
            device.setMeasurement(in_data, id)
            showMeasurements(device)
        }
    }
} )

document.getElementById('btn_del_measure').addEventListener('click', (event) => {
    if (selected_measurement) {
        deleteDialog( () => {
                if (device.measurements.length > 0) {
                    const id = Number(document.getElementById('measurement_number').innerHTML)
                    device.removeMeasurement(id)
                    showMeasurements(device)
                }
            },
            'measurements'
        )
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

    if (device.primary_verification) {
        document.getElementById('verification_type').value = 'первичная'
    } else {
        document.getElementById('verification_type').value = 'периодическая'
    }

    if (device.applicability) {
        document.getElementById('applicability').value = 'пригодно'
    } else if (device.applicability != undefined) {
        document.getElementById('applicability').value = 'непригодно'
    } else {
        document.getElementById('applicability').value = ''
    }
}

/** Insert measurement data to a form fields in measuement section. */
const readMeasurement = (id) => {
    const vals = device.getMeasurement(id) 
    fields = ['channel', 'm_value', 'ref_value', 'range']

    document.getElementById('measurement_number').innerHTML = id
    for (const field of fields) {
        if (vals[field] == undefined) {
            document.getElementById(field).value = ''
        } else {
            document.getElementById(field).value = vals[field]
        }
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
        osko: 'ОСКО, %',
    }

    let m_results = document.getElementById('measurements_results')

    m_results.innerHTML = ''

    for (const channel of device.getUnique('channel')) {
        m_results.appendChild(
            ui.jsonToTable(device.getMeasurements(channel), {
                id: `ch_${channel}`,
                caption: `Канал - ${channel}`,
                header: true,
                fields: fields,
                event_listener: {
                    click: [
                        ui.event_listeners.selectableRows,
                        measurementEventListener,
                        //ui.event_listeners.editableCells,
                    ],
                }
            } )
        )

        const stat = device.getStatistic(channel)
        if (stat.length > 0) {
            m_results.appendChild(
                ui.jsonToTable(stat, {
                    id: `stat_${channel}`,
                    caption: `Статистические показатели`,
                    header: true,
                    fields: fields_stat,
                } )
            )
        }
        m_results.appendChild(document.createElement('hr'))
    } 
}
 
const mi_info_fields = ['date', 'count_number', 'mi_type', 
    'mi_registry_number', 'mi_manufacture_year', 'mi_number']

/** Событие изменения поля ввода.
 * @debug: Добавить валидацию.
 * */
for (const id of mi_info_fields) {
    document.getElementById(id).addEventListener('change', (event) => {

    } )
}

/** Временная реализация для сохранения данных по АМ-5*/
const exportToCSV = () => {
    const devices = measurements.getDevices(0, -1, state.sort, 1, state.filter)
    const data = []

    devices.records.forEach( (dev) => {
        const record = []

        record.push('ам5')
        record.push(dev.mi_number)

        const vals = dev.measurements.map( (item) => {
            return item.m_value
        } )

        record.push(vals.pop())
        record.push(vals.join(' '))
        data.push(record.join(';'))
    } )

    app.WriteFile(`./db/${mDate.toDOMString(new Date())}.csv`, data.join('\n'))
    app.ShowPopup('Данные сохранены')
}

const exportToXLS = () => {
    const devices = measurements.getDevices(0, -1, state.sort, state.filter)
    const table = ui.jsonToTable(devices.records, {
        header: true,
        fields: {
            id: 'ID',
            date: 'Дата',
            count_number: 'Счет',
            mi_type: 'Тип СИ',
            mi_registry_number: 'ГРСИ',
            mi_number: 'Зав. №',
            mi_manufacture_year: 'Год изготовления',
            mi_owner: 'Собственник',
        },
    } ).innerHTML
    const data = xls.toXLS(table)
    app.WriteFile(`./db/${mDate.toDOMString(new Date())}.xls`, data)

    app.ShowPopup('Данные сохранены')
}

    /**app.ShowPopup('Данные сохраняются')

    const fields = {
        id: 'ID',
        date: 'Дата',
        count_number: 'Счет',
        mi_type: 'Тип СИ',
        mi_registry_number: 'ГРСИ',
        mi_number: 'Зав. №',
        mi_manufacture_year: 'Год изготовления',
        mi_owner: 'Собственник',
    }

    const data = []

    for (const device of devices.records) {
        const obj = {}
        for (const field of Object.keys(fields)) {
            obj[field] = devices[field]
        }
        data.push(obj)
    }

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Results")
    const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'buffer',
    } )

    app.WriteFile(`./db/${mDate.toDOMString(new Date())}.xlsx`, wbout)
    
    app.ShowPopup('Данные сохранены')
} )*/

document.getElementById('btn_export').addEventListener('click', exportToCSV)

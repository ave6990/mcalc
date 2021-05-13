/** Called after application is started. */
const measurements = {}

const getVal = (id, func) => {
    const res = document.getElementById(id).value   
    if (func) {
        return func(res)
    }

    return res
}

const measure = () => {
    const m_value = getVal('measured_value', Number)
    const ref_value = getVal('ref_value', Number)

    if (m_value) {
        const range = getVal('range', (value) => {
            return value.split('-').map( (val) => {
                return Number(val)
            } )
        } )
        //app.ShowPopup(range)
        return {channel: getVal('channel'),
            'ref_value': ref_value,
            measured_value: m_value,
            'range': range.join('-'),
            range_min: range[0],
            range_max: range[1],
            abs: metrology.absoluteError(m_value, ref_value),
            rel: metrology.relativeError(m_value, ref_value),
            ref: metrology.reducedError(m_value, ref_value, range[0], range[1]),
        }
    } else {
        return undefined
    }
}

const OnStart = () => {
    //document.getElementById('measurements').style.display = 'none'
    document.getElementById('date').value = mDate.toString(new Date())
    app.SetOrientation('Portrait')
}

/**
 * @description Select a contant of text fields.
 */
for (const element of document.getElementsByTagName('input')) {
    element.addEventListener('click', (event) => {
        event.target.select()
    })
}

const calculate_stat = (m_data) => {

}

document.getElementById('btn_add_mi').addEventListener('click', (event) => {
    app.ShowPopup('Данные СИ сохранены')
} )

$('#btn_add_measure').click( () => {
    const in_data = measure()
    const channel = document.getElementById('channel').value
    const fields = {
        ref_value: 'Xref',
        measured_value: 'Xi',
        range: 'R',
        abs: 'Δ',
        rel: 'δ, %',
        ref: 'γ, %',
    }

    if (!measurements[channel]) {
        measurements[channel] = { 'measurements': [], }
    }

    if (in_data) {
        document.getElementById('measurements_results').innerHTML = ''
        measurements[channel]['measurements'].push(in_data)
        for (const measurement of Object.keys(measurements)) {
            document.getElementById('measurements_results').innerHTML += `<p>Канал - ${measurement}</p>`
            document.getElementById('measurements_results').innerHTML += ui.jsonToTable(
                measurements[measurement]['measurements'],
                fields,
                `table_${measurement}`,
                true
            )
        }
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

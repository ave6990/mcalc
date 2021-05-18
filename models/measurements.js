class Measurements {
    constructor() {
        this.devices = []
        this.readData()
    }

    readData(path = './data/measurements.json') {
        const data = app.ReadFile('./db/measurements.json')
        this.devices = JSON.parse(data)
        //this.writeData('./data/backup.json')
    }

    writeData(path = './db/measurements.json') {
        const data = JSON.stringify(this.devices)
        app.WriteFile(path, data)
    }

    genDeviceID() {
        let id = 0

        if (this.devices.length > 0) {
            id = this.devices[this.devices.length - 1].id + 1
        }
        return id
    }

    getDevice(id) {
        return new Device(this.devices[this.getDeviceIndex(id)])
    }

    getDeviceIndex(id) {
        return this.devices.findIndex( (item) => {
            return item.id == id
        } )
    }

    setDevice(device) {
        this.devices[this.getDeviceIndex(device.id)] = device.getJSON()
    }
                
    addDevice(device) {
        //const id = this.genDeviceID()
        this.devices.push(Object.assign({}, device))
        //this.devices.push(device.getJSON()) 
    }

    removeDevice(id) {
        this.devices.splice(this.getDeviceIndex(id), 1)
    }
}

class Device {
    measurements = []
    statistic = []
    m_id = 1

    constructor(data) {
        this.setData(data)
    }

    setData(data) {
        Object.assign(this, data)
    }

    setDate(date) {
        this.date = date
    }

    setID(id) {
        this.id = id
    }

    getID() {
        return this.id
    }

    getStatID(channel, ref_val) {
        return this.statistic.filter( (item) => {
            return item.channel == channel
        } ).findIndex( (item) => {
            return item.ref_value == ref_val
        } )
    }

    addMeasurement(measurement) {
        Object.assign(measurement, this.calculate(measurement), {id: this.m_id})
        this.m_id++
        this.measurements.push(measurement) 

        if (this.measurements.length > 2) {
            this.calculateStatistics()
        }
    }

    setMeasurement(measurement, id) {
        Object.assign(measurement, this.calculate(measurement), {id: id})
        id = this.getMeasurementIndex(id)
        this.measurements.splice(id, 1, measurement)

        if (this.measurements.length > 2) {
            this.calculateStatistics()
        }
    }

    removeMeasurement(id) {
        id = this.getMeasurementIndex(id)
        this.measurements.splice(id, 1)
    }

    getMeasurement(id) {
        return this.measurements[this.getMeasurementIndex(id)]
    }

    getMeasurementIndex(id) {
        return this.measurements.findIndex( (item) => {
            return item.id == id
        } )
    }

    calculate(measurement) {
        measurement.m_value = measurement.m_value

        if (measurement.ref_value) {
            measurement.ref_value = measurement.ref_value
            measurement.abs_error = metrology.absoluteError(
                measurement.m_value, measurement.ref_value
            )
            measurement.rel_error = metrology.relativeError(
                measurement.m_value, measurement.ref_value
            )

            if (measurement.range) {
                const [min_lim, max_lim] = measurement.range.split('-').map( (val) => {
                    return Number(val)
                })
                measurement.min_range = min_lim
                measurement.max_range = max_lim
                measurement.red_error = metrology.reducedError(
                    measurement.m_value, measurement.ref_value, min_lim, max_lim
                )
            }
        }
    }

    calculateStatistics() {
        for (const channel of this.getUnique('channel')) {
            const measurements = this.getMeasurements(channel)
            for (const ref_val of this.getUnique('ref_value', measurements)) {
                const res = {}
                const cur_measurements = this.getMeasurements(channel, ref_val)
                if (cur_measurements.length > 2) {
                    res.channel = channel
                    res.ref_value = ref_val
                    
                    const vals = []
                    for (const val of cur_measurements) {
                        vals.push(val.m_value)
                    }
                    res.average_value = metrology.average(vals)
                    res.abs_error = metrology.absoluteError(res.average_value, res.ref_value)
                    res.rel_error = metrology.relativeError(res.average_value, res.ref_value)
                    res.range = cur_measurements[0].range
                    res.min_range = cur_measurements[0].min_range
                    res.max_range = cur_measurements[0].max_range

                    if (res.range) {
                        res.red_error = metrology.reducedError(res.average_value, res.ref_value,
                            res.min_range, res.max_range)
                    }

                    res.sko = metrology.sko(cur_measurements.map( (item) => {
                        return item.m_value
                    } ))

                    const index = this.getStatID(channel, ref_val)
                    
                    if (index < 0) {
                        this.statistic.push(res)
                    } else {
                        /** @debug Much more similar code */
                        this.statistic[index] = res
                    }
                }
            }
        }
    }

    getUnique(field, data) {
        const res = []
        if (!data) {
            data = this.measurements
        }

        data.map( (item) => {
            if (res.indexOf(item[field]) < 0) {
                res.push(item[field])
            }
        } )

        return res
    }

    getMeasurements(channel, ref_val = null) {
        const res = this.measurements.filter( (item) => {
            return item.channel == channel
        } )

        if (ref_val == null) {
            return res
        } else {
            return res.filter( (item) => {
                return item.ref_value == ref_val
            } )
        }
    }

    getStatistic(channel) {
        return  this.statistic.filter( (item) => {
            return item.channel == channel
        } )
    }

    getJSON() {
        return Object.assign({}, this)
    }
}

class Measurements {
    constructor() {
        this.devices = []
        //this.readData()
    }

    readData(path = './data/measurements.json') {
        const data = app.ReadFile('./data/measurements.json')
        this.devices = JSON.parse(data)
        //this.writeData('./data/backup.json')
    }

    writeData(path = './data/measurements.json') {
        const data = JSON.stringify(this.devices)
        app.WriteFile(path, data)
    }

    getDeviceID() {
        this.devices.length
    }

    getDevice(id) {
        return new Device(this.devices[id])
    }

    setDevice(device) {
        this.devices[device.id] = device.getJSON()
    }
                
    addDevice(device) {
        device.setID(this.getDeviceID())
        this.devices.push(device.getJSON()) 
    }

    delDevice(id) {
        this.devices.splice(id, 1)
    }
}

class Device {
    measurements = []

    constructor(data) {
        this.setData(data)
    }

    /** @debug: Add validation. */
    setData(data) {
        Object.assign(this, data)
        /**for (const key of Object.keys(this)) {
            if ([null, undefined, ''].indexOf(data[key])) {
                this[key] = null
            }
        }*/
    }

    setDate(date) {
        this.date = date
    }
    
    setCountNumber(number) {
        this.count_number = number
    }

    setRegistryNumber(number) {
        this.mi_registry_number = number
    }

    setType(type) {
        this.mi_type = type
    }

    setManufactureYear(year) {
        this.mi_manufacture_year = year
    }

    setOwner(owner) {
        this.mi_owner = owner
    }

    setID(id) {
        this.id = id
    }

    getID() {
        return this.id
    }

    addMeasurement(measurement) {
        Object.assign(measurement, this.calculate(measurement))
        this.measurements.push(measurement) 
    }

    setMeasurement(id) {
        Object.assign(measurement, this.calculate(measurement))
        this.measurements.splice(id, 1, measurement)
    }

    removeMeasurement(id) {
        this.measurements.splice(id, 1)
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

    getChannelsList() {
        let temp = this.measurements.map( (item) => {
            return item.channel
        } )
        return temp.filter( (v, i, s) => {
            return s.indexOf(v) === s.lastIndexOf(v)
        } )
    }

    getMeasurements() {

    }
}

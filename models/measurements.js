class Measurements {
    constructor() {
        this.devices = []
        this.current_id = 0
        //this.readData()
    }

    readData(path = './data/measurements.json') {
        const data = app.ReadFile('./data/measurements.json')
        this.devices = JSON.parse(data)
        this.writeData('./data/backup.json')
    }

    writeData(path = './data/measurements.json') {
        const data = JSON.stringify(this.devices)
        app.WriteFile(path, data)
    }

    getDevice(id) {
        return this.devices[id]
    }

    addDevice(device) {
       this.devices.push(device) 
    }

    calculate(channel, id) {
        Object.assign(this.channels[channel]) 
    }
}

class Device {
    constructor(data) {
        if (data) {

        }
    }

    setDate(date) {
        this.date = date
    }
}

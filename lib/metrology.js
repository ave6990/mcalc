/** Metrology library.
* @version 1.0.0
* @author ave6990
*/

const precision_count = 12

const metrology = {}

metrology.accuracy = (val) => {
    return parseFloat(val.toFixed(precision_count))
}

/** Returns the average value of the set.
* @param {number[]} vals - Set of values.
* @return {number}
*/
metrology.average = (vals) => {
    return metrology.accuracy(vals.reduce((res, val) => {
        return Number(res) + Number(val)
    }) / vals.length)
}

/** Returns a function to convert a value from one range to other.
* @param {number} s_min - Init limit of source range.
* @param {number} s_max - End limit of source range.
* @param {number} d_min - Init limit of destination range.
* @param {number} d_max - End limit of destination range.
* @return {Function}.
*/
metrology.rangeConverter = (s_min, s_max, d_min, d_max) => {
    return (value) => {
        return metrology.accuracy((value -s_min) * (d_max - d_min) / (s_max - s_min) + d_min)
    }
}

metrology.absoluteError = (m_val, s_val) => {
    return metrology.accuracy(m_val - s_val)
}

metrology.relativeError = (m_val, s_val) => {
    return metrology.accuracy((m_val - s_val) / s_val * 100)
}

metrology.reducedError = (m_val, s_val, min_val, max_val) => {
    return metrology.accuracy((m_val - s_val) / (max_val - min_val) * 100)
}

metrology.volumeToNc = (temp, pres) => {
    return (val) => {
        return metrology.accuracy(val * pres * 293.2 / ((273.2 + temp) * 101.3))
    }
}

metrology.v100nc = (temp, pres) => {
    return metrology.accuracy(100 * (273.2 + temp) * 101.3 / (pres * 293.2))
}

metrology.sko = (values) => {
    let n = values.length
    let nc = 0
    nc = values.reduce((res, val) => {
        return Number(res) + Number(val)
    }) / n
    let vals = values.map((val) => {
        return (val - nc) ** 2
    })
    return metrology.accuracy((vals.reduce((res, val) => {
        return res + val
    }) / (n - 1)) ** 0.5)
}

/** Metrology library.
* @version 1.0.0
* @author ave6990
*/

const precision_count = 12

const metrology = {}

/** Returns the average value of the set.
* @param {number[]} vals - Set of values.
* @return {number}
*/
metrology.average = (vals) => {
    return parseFloat((vals.reduce((res, val) => {
        return Number(res) + Number(val)
    }) / vals.length).toFixed(precision_count))
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
        return parseFloat(((value -s_min) * (d_max - d_min) / (s_max - s_min) + d_min).toFixed(precision_count))
    }
}

metrology.relativeError = (m_val, s_val) => {
    return parseFloat(((m_val - s_val) / s_val * 100).toFixed(precision_count))
}

metrology.reducedError = (m_val, s_val, n_val) => {
    return parseFloat(((m_val - s_val) / n_val * 100).toFixed(precision_count))
}

metrology.volumeToNc = (temp, pres) => {
    return (val) => {
        return parseFloat((val * pres * 293.2 / ((273.2 + temp) * 101.3)).toFixed(precision_count))
    }
}

metrology.v100nc = (temp, pres) => {
    return parseFloat((100 * (273.2 + temp) * 101.3 / (pres * 293.2)).toFixed(precision_count))
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
    return parseFloat((vals.reduce((res, val) => {
        return res + val
    }) / (n - 1)) ** 0.5).toFixed(precision_count)
}

/** ГСО-ПГС
 * @version 0.2.0
 * @author ave6990
 */
class SpanGas {    
    constructor( { conc, limit, name, category }) {
        this.conc = conc
        this.limit = limit
        this.category = category

        if (SpanGas.id) {      
            SpanGas.id++ 
        } else {
            SpanGas.id = 1
        }

        this.id = SpanGas.id
        this.name = name || `SpanGas#${SpanGas.id}`
    }

    get min() {
        return this.conc - this.limit
    }

    get max() {
        return this.conc + this.limit
    }

    get len() {
        return this.max - this.min
    }

    static sort(gas1, gas2) {
        return gas1.min - gas2.min
    }

    isIntersect(gas1, gas2) {
        let temp = sort(gas1, gas2)
        if (temp[0].max >= temp[1].min) {
            return true
        }
        return false
    }

    toJSON() {
        return {
            this.name,
            this.conc,
            this.limit,
            this.category,
        }
    }
}

const g1 = new SpanGas(2.2, 0.1)
const g2 = new SpanGas(1.1, 0.05)
const g3 = new SpanGas(4.4, 0.1)
console.log(g1, g2, g3)
console.log([g1, g2, g3].sort(SpanGas.sort))

export { SpanGas }

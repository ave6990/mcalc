const mDate = {}

mDate.firstZero = (val) => {
	if (val < 10) {
		return `0${val}`
	} else {
		return `${val}`
	}
}

mDate.toDate = (str, DOMString = false) => {
	const delimiter_list = ['.', ',', ':', '/', '-']
	const delimiter = delimiter_list.filter( (d) => {
		return str.indexOf(d) != -1
	} )
	if (delimiter.length == 0) {
		throw 'Delimiter not found. May be a wrong expression.'
	}
	const [ day, month, year ] = str.split(delimiter[0])

	return new Date(year, month - 1, day)
}

mDate.toString = (date, delimiter='.', reverse = false) => {
	const day = mDate.firstZero(date.getDate())

	if (isNaN(day)) {
		return undefined
	}

	const month = mDate.firstZero(date.getMonth() + 1)
	const year = date.getFullYear()

    if (reverse) {
        return [year, month, day].join(delimiter)
    }

	return [day, month, year].join(delimiter)
}

mDate.toDOMString = (date) => {
    return mDate.toString(date, '-', true)
}

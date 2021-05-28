const xls = {}

/** @params {Object[]} data */
xls.toXLS = (table, sheet_name) => {
    const base64 = (s) => {
        return window.btoa(unescape(encodeURIComponent(s)))
    }

    if (!sheet_name) {
        sheet_name = `${mDate.toDOMString(new Date())}`
    }

    const uri = 'data:application/vnd.ms-excel,'
    //const uri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://wwww.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheet_name}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body>${table}</body></html>`

    return `${uri}${template}`
}

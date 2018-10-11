function modify(book) {
  const id = book.worksheets[0].id
  const sheet = book.getWorksheet(id)
  //En esta parte se determina cual es el máximo de columnas ocupada en la hoja
  let maxNumColsByRow = 0
  const numRows = sheet.rowCount 
  for (let i = 1; i <= numRows; i++) {
    const row = sheet.getRow(i)
    if (row.cellCount > maxNumColsByRow) {
        maxNumColsByRow = row.cellCount
    }
  }
  //Se le agrega una columna a la hoja
  const colIdx = maxNumColsByRow + 1
  const colValues = [] //Columna donde se guardan arrays de longitudes
  //Recorre filas
  for (let i = 1; i <= numRows; i++) {
    const row = sheet.getRow(i)
    const arrayLengths = [] //Array donde se guarda la longitud del elemento de cada celda
    //Recorre cada celda
    for(let j = 1; j <= row.cellCount; j++ ){
        //
        arrayLengths.push((row.getCell(j).value || '').length)
    }
    colValues.push(arrayLengths.join(','))// Separa por comas los elementos
  }
  sheet.getColumn(colIdx).values = colValues
}
module.exports.modify = modify  
const upload = document.getElementById('upload')
const table = document.getElementById('table')
const title = document.getElementById('titleTable')

const cdg = canvasDatagrid({
  parentNode: table,
})
cdg.style.height = '100%'
cdg.style.width = '100%'

upload.onchange = ev => {
  const file = ev.target.files[0]
  var name = file.name
  //Aqui puede cambiar el título de la tabla
  title.innerHTML = name //Ejemplo: title.innerHTML = "Muestras de la Población"
  const formData = new FormData()
  formData.set('file', file)
  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then(r => r.blob())
    .then(loadSheet)
    .catch(err => console.error(err))
}

function loadSheet (blob) {
  const fileReader = new FileReader()
  fileReader.onload = ev => {
    const wb = XLSX.read(ev.target.result, { type: 'binary' })
    const json = toJson(wb)
    const firstSheetName = wb.SheetNames[0]
    displaySheet(json[firstSheetName])
  }
  fileReader.readAsBinaryString(blob)
}

function toJson (workbook) {
  var result = {}
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1})
    if(roa.length > 0) result[sheetName] = roa
  })
  return result
}

function displaySheet (rows) {
  /* set up table headers */
  var maxNumColsByRow = 0;
  rows.forEach(function(r) { if(maxNumColsByRow < r.length) maxNumColsByRow = r.length; })
  for(var i = 0; i < rows[0].length; ++i) {
    if (rows[0][i] === undefined) {
      rows[0][i] = ""
    }
  }
  for(var i = rows[0].length; i < maxNumColsByRow; ++i) {
    rows[0][i] = ""
  }

  /* load data */
  cdg.data = rows
  // reset the input
  upload.value = ''
}

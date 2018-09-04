const express = require('express')
const formidable = require('formidable')
const Excel = require('exceljs')

const app = express()

app.use(express.static('./public'))

app.post('/upload', (req, res) => {
    const form = formidable.IncomingForm()
    form.on('file', async (field, file) => {
        const filePath = file.path
        // Parse excel file
        const book = new Excel.Workbook()
        await book.xlsx.readFile(filePath)
        // Modify the book
        const sheet = book.getWorksheet(1)
        let L = 0
        const numRows = sheet.rowCount
        for (let i = 1; i <= numRows; i++) {
            const row = sheet.getRow(i)
            if (row.cellCount > L) {
                L = row.cellCount
            }
        }
        const colIdx = L + 1
        const colValues = []
        for (let i = 1; i <= numRows; i++){
            const row = sheet.getRow(i)
            const val = []
            for(let j = 1; j <= row.cellCount; j++ ){
                val.push((row.getCell(j).value || '').length)
            }
            colValues.push(val.join(','))
        }
        sheet.getColumn(colIdx).values = colValues
        // Write the book in a file
        await book.xlsx.writeFile(filePath + '.xlsx')
        // Return the modified file
        res.sendFile(filePath + '.xlsx')
    })
    form.parse(req)
})

app.listen(3000, () => {
    console.log('Server running in 3000')
})

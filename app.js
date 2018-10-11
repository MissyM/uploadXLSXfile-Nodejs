//SERVER
const express = require('express')
const formidable = require('formidable')
const Excel = require('exceljs')
const magic = require('./magic')

const app = express()

app.use(express.static('./public'))
//End point que se encarga de guardar la tabla
app.post('/upload', (req, res) => {
    const form = formidable.IncomingForm()
    form.on('file', async (field, file) => {
        const filePath = file.path
        // Parse excel file
        const book = new Excel.Workbook()
        await book.xlsx.readFile(filePath)
        // Modify the book
        magic.modify(book)
        
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

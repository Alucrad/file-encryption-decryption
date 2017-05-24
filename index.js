const {
    app,
    BrowserWindow
} = require('electron')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

let win

function createWindow() {
    win = new BrowserWindow({
        width: 500,
        height: 500,
        resizable: false
    })

    win.loadURL(`file://${__dirname}/index.html`)

    win.setMenu(null)

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

ipc.on('encrypt-open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files) event.sender.send('encrypt-selected-file', files)
    })
})

ipc.on('decrypt-open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files) event.sender.send('decrypt-selected-file', files)
    })
})

ipc.on('encrypt-save-dialog', (event) => {
    const options = {
        title: 'Save an Encryption',
        filters: [{
            name: 'Encrypt',
            extensions: ['enc']
        }]
    }
    dialog.showSaveDialog(options, (filename) => {
        event.sender.send('encrypt-saved-file', filename)
    })
})

ipc.on('decrypt-save-dialog', (event, path) => {
    const options = {
        title: 'Save an Decryption',
    }
    dialog.showSaveDialog(options, (filename) => {
        event.sender.send('decrypt-saved-file', filename)
    })
})
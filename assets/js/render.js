const ipc = require('electron').ipcRenderer
const crypto = require('crypto')
const fs = require('fs')

let encryptBrowse = document.getElementById('encryptBrowse')
let decryptBrowse = document.getElementById('decryptBrowse')
let encryptButton = document.getElementById('encryptButton')
let decryptButton = document.getElementById('decryptButton')
let encryptPassword = document.getElementById('encryptPassword')
let decryptPassword = document.getElementById('decryptPassword')
let encryptPassword2 = document.getElementById('encryptPassword2')
let decryptPassword2 = document.getElementById('decryptPassword2')
let encryptPath
let decryptPath

encryptBrowse.addEventListener("click", () => {
    ipc.send('encrypt-open-file-dialog')
}) 

decryptBrowse.addEventListener("click", () => {
    ipc.send('decrypt-open-file-dialog')
})

ipc.on('encrypt-selected-file', function (event, path) {
        document.getElementById('encryptPath').innerHTML = path
        encryptPath = `${path}`        
})

ipc.on('decrypt-selected-file', function (event, path) {
        document.getElementById('decryptPath').innerHTML = path
        decryptPath = `${path}`        
})

encryptButton.addEventListener("click", () => {
    console.log(encryptPath)  
    ipc.send('encrypt-save-dialog')
    let aes192cipher = crypto.createCipher('aes192', encryptPassword.value)
    let rc2cipher = crypto.createCipher('rc2', encryptPassword2.value)
    let input = fs.createReadStream(encryptPath)
    let output
    ipc.on('encrypt-saved-file', (event, path) => {
        output = fs.createWriteStream(`${path}`)
        input.pipe(aes192cipher).pipe(rc2cipher).pipe(output)
    })       
})

decryptButton.addEventListener("click", () => {
    console.log(decryptPath)
    ipc.send('decrypt-save-dialog')
    let aes192decipher = crypto.createDecipher('aes192', decryptPassword.value)
    let rc2dechipher = crypto.createDecipher('rc2', decryptPassword2.value)
    let input = fs.createReadStream(decryptPath)
    let output
    ipc.on('decrypt-saved-file', (event, path) => {
        output = fs.createWriteStream(`${path}`)
        input.pipe(rc2dechipher).pipe(aes192decipher).pipe(output)
    })    
})


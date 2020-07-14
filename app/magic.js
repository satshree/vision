const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const path = require('path')
const url = require('url')
const { spawn } = require('child_process')

app.name = "Vision"

var win;

function createWindow() {
    win = new BrowserWindow({
        width: 1100,
        minWidth: 800,
        height: 700,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadURL(url.format({
        // pathname: path.join(__dirname, 'index.html'),
        pathname: "localhost:3000",
        protocol: 'http',
        slashes: true
    }))

    // if (!isMac) {
    // win.removeMenu()
    // }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    app.quit()
})

ipcMain.on('NETWORK', (event, args) => {
    runEngine('networkscan.py', args, 'NETWORK')
})

function runEngine(file, args, channel) {
    // let cmd = path.join(__dirname, "../engine/networkscan.exe")
    let cmd = path.resolve(".", `engine/${file}`)

    // console.log("cmd:", cmd, args)
    // const bin = spawn(cmd, args)
    const bin = spawn("python", [cmd, args])

    bin.on("error", (err) => {
        console.log('ERROR', String.fromCharCode.apply(null, err))
        // reject(`ERR, ${String.fromCharCode.apply(null, err)}`)
        win.webContents.send(channel, "ERR")
    })

    bin.stderr.on("data", (data) => {
        console.log('ERR', String.fromCharCode.apply(null, data))
        // reject(`ERR, ${String.fromCharCode.apply(null, data)}`)
        win.webContents.send(channel, "ERR")
    })

    bin.stdout.on("data", (data) => {
        // console.log(String.fromCharCode.apply(null, data))
        win.webContents.send(channel, String.fromCharCode.apply(null, data))
        // win.webContents.send('RESULT', String.fromCharCode.apply(null, data))
    })
}
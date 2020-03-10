const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

function createWindow() {
    let win = new BrowserWindow({
        width:1500,
        // minwidth:800,
        height:800,
        // minheight:500,
        webPreferences:{
            nodeIntegration: true
        }
    })

    // win.loadFile('index.html')
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol:'file',
        slashes:true
    }))
}

// app.whenReady().then(createWindow)
app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // If not on mac
    // if (process.platform !== 'darwin') {
    app.quit()
    // }
})

// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length == 0){
//         createWindow()
//     }
// })
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

ipcMain.handle('SYSTEM_IP', async (event) => {
    let network = require('network')

    let ip = await getIP(network)
    let gateway = await getGatewayIP(network)

    // console.log({ ip, gateway })
    return { ip, gateway }

    
    // let os = require('os')
    // let ifaces = os.networkInterfaces();
    // // console.log(ifaces)

    // let ignoreIface = ["lo", "eth0"]
    // Object.keys(ifaces).forEach(function (ifname) {
    //     // console.log("here", ifname)
    //     let iface = ifaces[ifname]
    //     if (ignoreIface.indexOf(ifname) === -1) {
    //         iface.forEach(function(ifn){
    //             if(ifn.family === "IPv4" && !ifn.internal) {
    //                 event.returnValue = ifn.address
    //             }
    //         })
    //     }
    // })
})

function getIP(network) {
    return new Promise((resolve) => {
        network.get_private_ip(function(err, ip) {
            // console.log("ERR", err)
            // console.log("IP", ip)
            resolve(err || ip)
        })
    })
}

function getGatewayIP(network){
    return new Promise((resolve) => {
        network.get_gateway_ip(function(err, ip) {
            // console.log("gERR", err)
            // console.log("gIP", ip)
            resolve(err || ip)
        })
    })
}
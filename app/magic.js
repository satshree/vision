const {
    app,
    BrowserWindow,
    ipcMain,
    session
} = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const os = require('os');
const process = require('process');

app.name = "Vision"

var win;
var bin;

const isMac = process.platform === "darwin"

function createWindow() {
    win = new BrowserWindow({
        width: 1100,
        minWidth: 800,
        height: 700,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(url.format({
        // pathname: path.join(__dirname, 'index.html'),
        pathname: "localhost:3000",
        protocol: 'http',
        slashes: true
    }));

    loadReactDevTools();
    // loadReduxDevTools();

    // if (!isMac) {
    // win.removeMenu()
    // }
}


// DEV TOOLS
async function loadReactDevTools() {
    const ses = await session.defaultSession.loadExtension(
        path.join(
            os.homedir(),
            ".config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.8.2_0"
        )
    );

    return ses
}

async function loadReduxDevTools() {
    const ses = await session.defaultSession.loadExtension(
        path.join(
            os.homedir(),
            ".config/google-chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"
        )
    );

    return ses
}


// APP EVENTS
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});


// IPC CHANNELS
ipcMain.on('NETWORK', (event, args) => {
    let range;
    let mode;

    if (args.indexOf("default") === -1) {
        mode = args[0]
        range = args[1]
    } else {
        mode = args
        range = null
    }

    runEngine('networkscan.py', mode, range, 'NETWORK');
});

ipcMain.on('OS', (event, args) => {
    let range = null;
    let mode = args;

    runEngine('osscan.py', mode, range, 'OS');
})

ipcMain.on('PORT', (event, args) => {
    let mode = args[0];
    let range = args[1];

    runEngine('portscan.py', mode, range, 'PORT');
})

ipcMain.handle('SYSTEM_IP', async (event) => {
    let network = require('network');

    let ip = await getIP(network);
    let gateway = await getGatewayIP(network);

    // console.log({ ip, gateway })
    return { ip, gateway }
});

ipcMain.handle('KILL', () => {
    try {
        console.log("killing");
        bin.kill("SIGINT");
    } catch (err) {
        console.log("Cannot kill process");
        console.log(err);
    }
});


// FUNCTIONS
function runEngine(file, mode, range, channel) {
    // let cmd = path.join(__dirname, "../engine/networkscan.exe")
    let cmd = `${path.resolve(".", `engine/${file}`)}`

    // console.log("cmd:", cmd, mode)

    if (range) {
        bin = spawn("sudo", ["python3", cmd, mode, range]); 
    } else {
        bin = spawn("sudo", ["python3", cmd, mode]);
    }

    // bin.on("error", (err) => {
    //     console.log('ERROR', String.fromCharCode.apply(null, err));
    //     // reject(`ERR, ${String.fromCharCode.apply(null, err)}`)
    //     win.webContents.send(channel, "ERR");
    // });

    bin.stderr.on("data", (data) => {
        console.log('ERR', String.fromCharCode.apply(null, data));
        // reject(`ERR, ${String.fromCharCode.apply(null, data)}`)
        win.webContents.send(channel, "ERR");
    });

    bin.stdout.on("data", (data) => {
        // console.log(String.fromCharCode.apply(null, data))
        win.webContents.send(channel, String.fromCharCode.apply(null, data));
    });
}

function getIP(network) {
    return new Promise((resolve) => {
        network.get_private_ip(function(err, ip) {
            // console.log("ERR", err)
            // console.log("IP", ip)
            resolve(err || ip);
        });
    });
}

function getGatewayIP(network){
    return new Promise((resolve) => {
        network.get_gateway_ip(function(err, ip) {
            // console.log("gERR", err)
            // console.log("gIP", ip)
            resolve(err || ip);
        });
    });
}
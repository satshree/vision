const {
    app,
    BrowserWindow,
    ipcMain,
    session,
    dialog
} = require('electron');
const path = require('path');
const url = require('url');
const { spawn, exec } = require('child_process');
const os = require('os');
const process = require('process');
// const psTree = require('ps-tree');

app.name = "Vision"

var win;
var bin;

// const isMac = process.platform === "darwin";
// const isWin = process.platform === "win32";
// const isLinux = process.platform === "linux";

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

    // win.loadURL(url.format({
    //     pathname: "localhost:3000",
    //     protocol: 'file:',
    //     slashes: false
    // }));

    win.loadFile('build/index.html');
    
    win.removeMenu()
}

async function alertUser() {
    const options = {
        type: 'warning',
        title: 'Administrator Privileges Required.',
        message: 'Please run Vision as admin.',
        detail: "Vision requires admin privilege to utilize system's interfaces to scan the network.",
    };
    
    dialog.showMessageBoxSync(null, options);
}

// APP EVENTS
app.on('ready', () => {
    exec('NET SESSION', function(err,so,se) {
        se.length === 0 ? createWindow() : alertUser().then(() => app.quit());
    });
});

app.on('window-all-closed', () => {
    app.quit();
});


// IPC CHANNELS
ipcMain.on('NETWORK', (event, args) => {
    let arg2;
    let arg1;

    if (args.indexOf("default") === -1) {
        arg1 = args[0]
        arg2 = args[1]
    } else {
        arg1 = args
        arg2 = null
    }

    runEngine('networkscan.exe', arg1, arg2, 'NETWORK');
});

ipcMain.on('OS', (event, args) => {
    let arg2 = null;
    let arg1 = args;

    runEngine('osscan.exe', arg1, arg2, 'OS');
})

ipcMain.on('PORT', (event, args) => {
    let arg1 = args[0];
    let arg2 = args[1];

    runEngine('portscan.exe', arg1, arg2, 'PORT');
})

ipcMain.on('SAVE', (event, args) => {
    let arg2 = null;
    let arg1 = args;

    runEngine('save.exe', arg1, arg2, 'SAVE');
})

ipcMain.on('BANNER', (event, args) => {
    let arg2 = args[1];
    let arg1 = args[0];

    runEngine('bannergrab.exe', arg1, arg2, 'BANNER');
})

ipcMain.on('IMPORT', (event, args) => {
    let arg2 = null;
    let arg1 = args;

    runEngine('visualize.exe', arg1, arg2, 'IMPORT');
})

ipcMain.handle('SYSTEM_IP', async (event) => {
    let network = require('network');

    let ip = await getIP(network);
    let gateway = await getGatewayIP(network);

    return { ip, gateway }
});

ipcMain.handle('KILL', () => {
    try {
        let cp = require('child_process');
        cp.exec('taskkill /PID ' + bin.pid + ' /T /F', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if(error !== null) {
                console.log('exec error: ' + error);
            }
        });        
    } catch (err) {
        console.log("Cannot kill process");
        console.log(err);
    }
});


// FUNCTIONS
function runEngine(file, arg1, arg2, channel) {
    let cmd = `${path.resolve(".", `engine/${file}`)}`

    if (arg2) {
        bin = spawn(cmd, [arg1, arg2]); 
    } else {
        bin = spawn(cmd, [arg1]);
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

// const kill = function (pid, signal, callback) {
//     signal   = signal || 'SIGKILL';
//     callback = callback || function () {};
//     let killTree = true;
//     if(killTree) {
//         psTree(pid, function (err, children) {
//             [pid].concat(
//                 children.map(function (p) {
//                     return p.PID;
//                 })
//             ).forEach(function (tpid) {
//                 try { process.kill(tpid, signal) }
//                 catch (ex) { console.log("ERROR1 KILL", ex) }
//             });
//             callback();
//         });
//     } else {
//         try { process.kill(pid, signal) }
//         catch (ex) { console.log("ERROR2 KILL", ex) }
//         callback();
//     }

//     console.log("KILLED");
// };
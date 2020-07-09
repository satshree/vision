// const {
//     app, 
//     BrowserWindow, 
//     // Menu
// } = require('electron')
// const path = require('path')
// const url = require('url')

// // const isMac = process.platform === "darwin"
// app.name = "Vision"

// // const template = [
// //     {
// //         label: 'File',
// //         submenu: [
// //             { role: 'close' },
// //             { role: 'quit' }
// //         ]
// //     },
// //     {
// //         label: 'View',
// //         submenu: [
// //             { role: 'reload' },
// //             { role: 'forcereload' },
// //             { type: 'separator' },
// //             { role: 'toggledevtools' },
// //             { role: 'togglefullscreen' }
// //         ]
// //     },
// //     {
// //         label: 'Window',
// //         submenu: [
// //             { role: 'minimize' },
// //             { role: 'zoom' },
// //             { type: 'separator' },
// //             { role: 'front' },
// //             { type: 'separator' },
// //             { role: 'window' },
// //             { role: 'close' }
// //         ]
// //     },
// //     {
// //         role: 'help',
// //         submenu: [
// //             {
// //                 label: 'Learn More',
// //                 click: async () => {
// //                     const { shell } = require('electron')
// //                     await shell.openExternal('https://github.com/satshree/vision')
// //                 }
// //             }
// //         ]
// //     }
// // ]

// function createWindow() {
//     let win = new BrowserWindow({
//         width:1500,
//         // minwidth:800,
//         height:800,
//         // minheight:500,
//         webPreferences:{
//             nodeIntegration: true
//         }
//     })

//     // win.loadFile('index.html')
//     win.loadURL(url.format({
//         pathname: path.join(__dirname, 'index.html'),
//         protocol:'file',
//         slashes:true
//     }))

//     // if (!isMac) {
//     win.removeMenu()
//     // }
// }

// // if (isMac) {
// //     template.unshift(
// //         {
// //             label:app.name,
// //             submenu:[
// //                 { role: 'about' },
// //                 { type: 'separator' },
// //                 { role: 'services' },
// //                 { type: 'separator' },
// //                 { role: 'hide' },
// //                 { role: 'hideothers' },
// //                 { role: 'unhide' },
// //                 { type: 'separator' },
// //                 { role: 'quit' }
// //             ]
// //         }
// //     )
// //     const menu = Menu.buildFromTemplate(template)
// //     Menu.setApplicationMenu(menu)
// // } else {

// // }

// app.on('ready', createWindow)

// app.on('window-all-closed', () => {
//     app.quit()
// })
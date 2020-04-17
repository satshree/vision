const swal = require('sweetalert')
const remote = require('electron').remote
const spawn = require('child_process').spawn

function boot() {
    const pyshell = spawn("python", ["./engine/boot.py"]);

    pyshell.on('error', (err) => {
        console.log(err)
        swal({
            title:"Seems like you have not installed Python!",
            text:"Please install Python to proceed.",
            icon:"warning"
        }).then(() => {
            const w = remote.getCurrentWindow()
            w.close()
        })
    })
    // pyshell.stderr.on('data', (err) => console.log("ERROR", String.fromCharCode.apply(null, err)))

    window.first = false
    pyshell.stdout.on('data', (message) => {
        message = JSON.parse(message)
        if (message == "INSTALL") {
            window.first = true
            swal({
                title:"Setting up Vision!",
                text:"Installing few required python modules.",
                icon:"./loading.gif",
                buttons:false
            })
        } else {
            if (window.first) {
                swal({
                    title:"You are good to go!",
                    text:" ",
                    icon:"success",
                    buttons:false,
                    timer:2000
                })
            }
            document.getElementById("ip").innerHTML = message.ip
            document.getElementById("gateway").innerHTML = message.gateway
        }
    })
}
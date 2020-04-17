const {PythonShell} = require('python-shell')
const path = require("path")
window.$ = window.jQuery = require('./js/jquery.js');

function displayData() {
    var app = new Vue({
        el:"#result",
        data:{
            result:null,
        },
        methods:{
            hostExists() {
                if (this.getData()) {
                    // console.log(this.getData())
                    // return true
                    let obj = this.getData()
                    if (Object.keys(obj).length === 0 && obj.constructor === Object) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            },
            scanOS(ip) {
                $("#scanOsProgress").show()
                $("#osHost").html(ip)
                $(".os-btn").attr("disabled", "disabled")

                let options = {
                    scriptPath : path.join(__dirname, './engine/'),
                    args: [ip]
                }

                let osScript = new PythonShell("os.py", options)

                osScript.on('message', (message) => {
                    $(`#${ip}`).html(message)
                    this.mountOS(ip, message)
                    $("#scanOsProgress").hide()
                    $(".os-btn").removeAttr("disabled")
                    osScript.terminate()
                })
            },
            mountData(data) {
                this.result = data
                setTimeout(mountTime, 100)
            },
            mountPort(host, ports) {
                this.getData()[host].Ports = ports
            },
            mountOS(host, os) {
                this.getData()[host].OS = os
            },
            getData() {
                return this.result
            }
        },
        mounted:function(){
            //
        },
        created:function(){
            // console.log("From Vue,", this.result)
        }
    })

    return app
}

function initializeScan(args) {
    scanning = true
    document.getElementById("result").style.display = 'none'
    document.getElementById("progressBox").style.display = 'block'
    document.getElementById("progressBackground").style.display = 'block'
    
    var vueObj = displayData()
    window.vueObj = vueObj
    var method = args[0]

    if (method == "particular" || method == "default") {
        document.getElementById("progressBar").className = "indeterminate"
    } else {
        document.getElementById("progressBar").className = "determinate"
    }

    result = new Promise((resolve, reject) => {
        
        var options = {
            scriptPath : path.join(__dirname, './engine/'),
            args: args
        }
    
        try {
            window.pyshell = new PythonShell('main.py', options)

            window.pyshell.on('message', (message) => {
                // console.log(message)
                if (message.indexOf("Scanning") == -1) {
                    scanning = false

                    if (method != "default") {
                        document.getElementById("progressBar").style.width = '0'
                    } 
                    
                    $("#resultContainer").ready(() => {
                        if (method == "particular") {
                            document.getElementById("rangeScan").style.display = 'none'
                            document.getElementById("particularScan").style.display = 'block'
                        } else if (method == "range") {
                            document.getElementById("particularScan").style.display = 'none'
                            document.getElementById("rangeScan").style.display = 'block'
                        }
                    })

                    document.getElementById("progressBox").style.display = 'none'
                    document.getElementById("progressBackground").style.display = 'none'
                    document.getElementById("result").style.display = 'block'
                    document.getElementById("progressBackground").innerHTML = ''
    
                    resolve(JSON.parse(message))
                    
                } else {
                    if (method == "range") {
                        let progress = message.split(",")[1]
                        let displayMessage = message.split(",")[0]
                        document.getElementById("progressBackground").innerHTML = `<strong>${displayMessage}</strong>`
                        if (displayMessage.indexOf("port") !== -1) {
                            document.getElementById("progressBar").className = "indeterminate"
                        } else {
                            document.getElementById("progressBar").style.width = `${progress}%`
                        }
                    } else {
                        document.getElementById("progressBackground").innerHTML = `<strong>${message}</strong>`
                    } 
                }
            })

            window.pyshell.on('stderr', (stderr) => {
                reject(stderr)
            })
        } catch (err) {
            displayError(err)
        }
    }).then((result) => {
        vueObj.mountData(result);
        if (method != "particular") {
            visualize(result)
        }
        window.pyshell.terminate();
    }).catch((err) => {
       displayError(err)
       window.pyshell.terminate();
    })

    return vueObj
}

function scanPort(btn) {
    // console.log($(btn))
    $("#hostIP").val($(btn).attr("ip"))
    $("#portModal").modal("open")
}

function displayError(err) {
    document.getElementById("result").innerHTML = `
    <div>
        <strong> <i class="fas fa-exclamation-triangle"></i> Something went wrong! </strong> <br>
        <small> Error Details: "${err}" </small> <br> <br>
        <button type="button" class="btn waves-effect waves-light" onclick="location.reload()"> <i class="fas fa-redo" style="margin-right:5px;"></i> Reload </button>
    </div>
`
}

function save(result) {
    return new Promise((resolve) => {
        let options = {
            scriptPath : path.join(__dirname, './engine/'),
            args: [result]
        }
        let run = new PythonShell('save.py', options)
        
        run.on('message', (status) => {
            run.terminate()
            resolve(status)
        })
    })
}

function mountTime() {
    let finished = new Date()
    let timetaken = Math.floor((finished.getTime() - window.time.getTime())/1000)
    let minutetaken = Math.floor(timetaken/60)
    $("#timeTaken").html(`Total Time Taken To Scan: ${timetaken} seconds. (Roughly ${minutetaken} minutes)`)
}

$(document).ready(() => $("#portModal").modal())

$("#scanPortForm").submit(function(event) {
    event.preventDefault()

    $("#scanPortFormDiv").hide()
    $("#scanPortProgress").show()

    let host = $("#hostIP").val()
    let ports = $("#ports").val()

    let options = {
        scriptPath : path.join(__dirname, './engine/'),
        args: [host, "ports", ports]
    }

    let portScript = new PythonShell("port.py", options)

    portScript.on('message', (message) => {
        let openPorts = JSON.parse(message)

        if (openPorts.length > 0) {
            window.vueObj.mountPort(host, openPorts)
        } else {
            swal({
                text:"No Open Ports Found.",
                icon:"warning"
            })
        }

        $("#portModal").modal("close")
        $("#scanPortFormDiv").show()
        $("#scanPortProgress").hide()
        portScript.terminate()
    })
})
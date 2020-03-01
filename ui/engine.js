var {PythonShell} = require('python-shell')
var path = require("path")

function displayData() {
    var app = new Vue({
        el:"#result",
        data:{
            result:null,
        },
        methods:{
            hostExists() {
                if (this.getData()) {
                    if (this.getData().length > 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            },
            mountData(data) {
                this.result = data
            },
            getData() {
                return this.result
            }
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
    var method = args[0]

    if (method == "particular" || method == "default") {
        document.getElementById("progressBar").className = "indeterminate"
    } else {
        document.getElementById("progressBar").className = "determinate"
    }

    result = new Promise((resolve) => {
        
        var options = {
            scriptPath : path.join(__dirname, '../'),
            args: args
        }
    
        try {
            let pyshell = new PythonShell('main.py', options)

            pyshell.on('message', function(message) {
                // console.log(message)
                if (message.indexOf("Scanning") == -1) {
                    scanning = false

                    if (method != "default") {
                        document.getElementById("progressBar").style.width = '0'
                    }

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
                        document.getElementById("progressBar").style.width = `${progress}%`
                    } else {
                        document.getElementById("progressBackground").innerHTML = `<strong>${message}</strong>`
                    } 
                }
            })
        } catch (err) {
            displayError(err)
        }
    }).then((result) => {
        vueObj.mountData(result)
    }).catch((err) => {
       displayError(err)
    })

    return vueObj
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
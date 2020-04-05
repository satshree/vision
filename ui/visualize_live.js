const {Chart} = require('chart.js')
const {PythonShell} = require('python-shell')
const path = require("path")
const swal = require('sweetalert')

function visualize() {

    let options = {
        scriptPath:path.join(__dirname, '../')
    }

    let script = new PythonShell('monitor.py', options)

    window.labels = []
    window.data = []
    window.backgroundColor = []
    window.borderColor = []

    script.on('message', (message) => {
        let currentData = JSON.parse(message)
        // console.log(JSON.parse(message))

        if (currentData.IP.indexOf("ERROR") !== -1) {
            script.terminate()
            let err = currentData.IP.split(",")[1]
            displayError(err)
        }

        // console.log("Index", currentData.IP, window.labels.indexOf(currentData.IP))
        if (currentData) {
            if (window.labels.indexOf(currentData.IP) == -1) {
                let colorR = Math.floor((Math.random() * 300) + 1);
                let colorG = Math.floor((Math.random() * 300) + 1);
                let colorB = Math.floor((Math.random() * 300) + 1);
        
                let background = `rgba(${colorR}, ${colorG}, ${colorB}, 0.1)`
                let border = `rgba(${colorR}, ${colorG}, ${colorB}, 1)`
    
                window.labels.push(currentData.IP)
                window.data.push(currentData.Count)
                window.backgroundColor.push(background)
                window.borderColor.push(border)
            } else {
                let index = window.labels.indexOf(currentData.IP)
                window.data[index] = currentData.Count
            }
        }
        // $(window).trigger('resize');
        // window.dispatchEvent(new Event('resize'));
        
        // setTimeout(() => script.terminate(), 10000)
        // renderChart()
    })

    ctx = document.getElementById("graphical").getContext("2d");

    let data = {
        labels: window.labels,
        responsive:true,
        datasets: [{
            label: 'Total Web Requests',
            data: window.data,
            backgroundColor: window.backgroundColor,
            borderColor: window.borderColor,
            borderWidth: 1
        }]
    }

    let chartOptions = {
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                },
            }]
        },
        legend:{
            display:false
        }
    }
    
    window.myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: chartOptions
    });

    // myBarChart.update()
    // setInterval(renderChart, 1000)
} 

// function renderChart() {
//     console.log("RENDERED")
//     // window.myBarChart.destroy()
//     window.myBarChart.render()
//     // try {
//     //     window.myBarChart.render()
//     // } catch (err) {
//     //     console.log(err)
//     // }
// }

function displayError(err) {
    document.getElementById("graphical").style.display='none';
    document.getElementById("msg").style.display='none';
    document.getElementById("err").style.display='block';

    document.getElementById("err").innerHTML = `
        <strong> <i class="fas fa-exclamation-triangle"></i> Something went wrong! </strong> <br>
        <small> Error Details: "${err}" </small> <br> <br>
        <button type="button" class="btn waves-effect waves-light" onclick="location.reload()"> <i class="fas fa-redo" style="margin-right:5px;"></i> Reload </button>
    `
}
const {Chart} = require('chart.js')

function visualize(results) {

    let options = {
        scriptPath:path.join(__dirname, '../'),
        args:[JSON.stringify(results)]
    }

    let script = new PythonShell('organize.py', options)

    window.labels = []
    window.data = []
    window.backgroundColor = []
    window.borderColor = []

    script.on('message', (message) => {
        let host = JSON.parse(message)
        // console.log(JSON.parse(message))
        
        for (let i=0; i<=host.length; i++) {
            let currentData = host[i]
            if (currentData) {
                let colorR = Math.floor((Math.random() * 300) + 1);
                let colorG = Math.floor((Math.random() * 300) + 1);
                let colorB = Math.floor((Math.random() * 300) + 1);
        
                let background = `rgba(${colorR}, ${colorG}, ${colorB}, 0.1)`
                let border = `rgba(${colorR}, ${colorG}, ${colorB}, 1)`
    
                window.labels.push(currentData.Vendor)
                window.data.push(currentData.Count)
                window.backgroundColor.push(background)
                window.borderColor.push(border)
            }
        }

        script.terminate()
    })

    $("#graphical").ready(function() {
        ctx = document.getElementById("graphical").getContext("2d");
    
        let data = {
            labels: window.labels,
            responsive:true,
            datasets: [{
                label: 'Total Devices',
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
        
        let myBarChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: data,
            options: chartOptions
        });

        // myBarChart.update()
    })
} 
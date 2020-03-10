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
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: window.labels,
            responsive:true,
            datasets: [{
                label: 'Total Devices',
                // data: [12, 19, 3, 5, 2, 3],
                data: window.data,
                // backgroundColor: [
                //     'rgba(255, 99, 132, 0.2)',
                //     'rgba(54, 162, 235, 0.2)',
                //     'rgba(255, 206, 86, 0.2)',
                //     'rgba(75, 192, 192, 0.2)',
                //     'rgba(153, 102, 255, 0.2)',
                //     'rgba(255, 159, 64, 0.2)'
                // ],
                backgroundColor: window.backgroundColor,
                // borderColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(54, 162, 235, 1)',
                //     'rgba(255, 206, 86, 1)',
                //     'rgba(75, 192, 192, 1)',
                //     'rgba(153, 102, 255, 1)',
                //     'rgba(255, 159, 64, 1)'
                // ],
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
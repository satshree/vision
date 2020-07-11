import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2'

class Graphs extends Component {
    getChartOptions() {
        return {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                }]
            },
            legend: {
                display: false
            },
            maintainAspectRatio: true,
            responsive: true
        }
    }

    render() {
        return (
            <React.Fragment>
                <HorizontalBar
                    data={this.props.data}
                    width={50}
                    height={15}
                    options={this.getChartOptions()}
                />
            </React.Fragment>
        )
    }
}

export default Graphs
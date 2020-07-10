import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'

class Graphs extends Component {
    render() {
        return (
            <React.Fragment>
                <br></br>
                <Bar
                    data={this.props.data}
                    width={100}
                    height={300}
                    options={{ maintainAspectRatio: false }}
                />
            </React.Fragment>
        )
    }
}

export default Graphs
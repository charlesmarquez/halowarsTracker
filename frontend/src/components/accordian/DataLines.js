import React, { Component } from 'react';
import { LineSeries } from 'react-vis';

export default class DataLines extends Component {
    render() {
        const {data, count} = this.props

        console.log(data)

        return (
            <LineSeries data={data} key={count} opacity={data.opacity} curve={'curveMonotoneX'} onSeriesClick={this.test}/>
        )
    }
}

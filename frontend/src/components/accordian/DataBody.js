import React, { Component } from 'react'
import { Card } from "react-bootstrap";
import DataChart from './DataChart';
import CheckBoxes from './CheckBox'

export default class DataBody extends Component {
    handleBox = (event) => {
		console.log(event)
		this.setState({
			checkedItems: event
		})
    }

    render() {
        return (
            <Card.Body>
            <DataChart data={this.props.data}></DataChart>
            </Card.Body>
        )
    }
}

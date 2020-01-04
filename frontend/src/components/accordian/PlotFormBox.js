import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

const type = 'checkbox'
const ref = React.createRef();

export default class PlotFormBox extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            boxState: {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
            }
        }
    }
    

    handleChange = (ref) => {
        console.log(ref)
        // this.setState(*set checkbox state here*);
    }

    render() {
        return (
            <Form>
                <Form.Text>Supply</Form.Text>
                <div key={`inline-${type}`} className="mb-3">
                    <Form.Check inline label="Rate" type={type} id={`inline-${type}-1`} ref={ref}/>
                    <Form.Check inline label="Total" type={type} id={`inline-${type}-2`} onChange={this.handleChange}/>
                    <Form.Check inline label="Current" type={type} id={`inline-${type}-3`} onChange={this.handleChange}/>
                </div>
                <Form.Text>Energy</Form.Text>
                <div className="mb-3">
                    <Form.Check inline label="Rate" type={type} id={`inline-${type}-4`} onChange={this.handleChange}/>
                    <Form.Check inline label="Total" type={type} id={`inline-${type}-5`} onChange={this.handleChange}/>
                    <Form.Check inline label="Current" type={type} id={`inline-${type}-6`} onChange={this.handleChange}/>
                </div>
        </Form>
        )
    }
}

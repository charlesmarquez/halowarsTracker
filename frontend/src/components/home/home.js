import React, { Component } from 'react'
import MatchQuery from './query';

export default class home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            counter: 0    
        }
    }
    
    clicked() {
        var x = this.state.counter + 1
        this.setState({
            counter: x
        })
        // console.log(this.state.counter)
    }

    render() {
        // const x = 'X lol'
        return (
            // <button onClick={() => this.clicked()}>
            //     Button [{this.state.counter}]
            // </button>
            <div>
            <MatchQuery></MatchQuery>
            </div>
        )
    }
}
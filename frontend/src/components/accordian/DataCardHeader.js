import React, { Component } from 'react'
import { Card } from "react-bootstrap";

const imgStyle = {
    height: 100
}

export default class DataCardHeader extends Component {
    render() {
        const {data} = this.props

        return (
            <div>
                <Card.Title>
                {data.MapName}
                </Card.Title>
                <Card.Subtitle>
                {data.Playlist}
                </Card.Subtitle>
                <div>
                {data.LastOnline}
                </div>
            </div>
        )
    }
}

import React, { Component } from 'react'

import {AutoSizer} from 'react-virtualized'; 
import { Card } from 'react-bootstrap'
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, Crosshair} from 'react-vis';
import { DiscreteColorLegend } from "react-vis";
import _ from "underscore";
import { stringify } from 'querystring';

const plotheight = 400;

const plotwidth = 1000;

const containerStyle = {
    // display: 'flex',
    plotheight: plotheight,
    plotwidth: plotwidth
}

// const plotStyle = {
//     display: 'inline-block',
//     height: 400,
//     width: 1000
// }

const legendStyle = {
    display: 'inline-block',
    height: 250,
    width: 300
}

const axisStyle = {
    'fontSize': '8.5px',
    title: {
        fontSize: '16px'
    }
}

const crosshairStyle = {
    borderRadius: '15px',
    background: '#333333',
    padding: '12px',
    width: '200px',
    height: '150px',
    opacity: 1
}

export default class DataPlots extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            data: [],
            crosshairValues: []      
        };
      }
    
    componentDidMount = () => {
        let items = this.state
        items = [];
        for (const player of this.props.legend) {
            items.push({
                title: player.HumanPlayerId.Gamertag + ` (${player.Leader.Name})`,
                opacity: 1
            })
        }
        if (this.props.popData) {
            this.setState({
                popData: this.props.popData,
                unitData: []
            })
        }
        this.setState((state, props) => {
            return {
                items: items,
                data: this.props.data,
                crosshairValues: []
            }
        })
    }

    _clickHandler = item => {
        const {items} = this.state;
        item.disabled = !item.disabled;
        item.disabled ? item.opacity = 0 : item.opacity = 1
        this.setState({items});
    };

    _onMouseLeave = () => {
        let items = this.state
        items = [];
        for (const player of this.props.legend) {
            items.push({
                title: player.HumanPlayerId.Gamertag + ` (${player.Leader.Name})`,
                opacity: 1
            })
        }
        this.setState({ 
            crosshairValues: [],
            items: items
        });
      };
    
    _onNearestX = (value, {index}) => {
        const {items} = this.state
        const x = this.state.data.map(d => d[index])

        for (let i = 0; i < x.length; i++) {
            items[i].title = String(x[i].y.toFixed(2))           
        }

        this.setState({crosshairValues: this.state.data.map(d => d[index])});
      };

    filterData = (data, time) => {
        data = data.filter(x => x.PopulationCost > 0)
        data = data.filter(x => x.TimeTrained < time*1000 )
        data = data.filter(x => x.TimeDeath > time*1000 )
        // console.log(data, time, this.props.legend)
        const z = []
        const b2 = []
        const res = []
        
        for (const player of this.props.legend) {
            let x = data.filter(x => x.PlayerIndex === player.PlayerIndex)
            z.push(x)
        }
        
        for (const j of z) {
            const b = []
            for (const i of j) {
                if (i.SquadName) {
                    b.push(i.SquadName)
                } else {
                    b.push(i.SquadId)
                }
            }
            b2.push(b)
        }

        for (const i of b2) {
            const x = _.countBy(i)
            res.push(x)
        }

        this.setState({
            unitData: res
        })

        console.log(this.state.unitData)

    }

    _onClick = () => {
        const data = this.props.popData
        const time = this.state.crosshairValues[0].x

        this.filterData(data, time)
    }

    Legend = () => {
        if (this.props.title === "Population") {
            return (
                <this.PopTable/>
                )
        } else {
            return (
                <div className="legend" style={legendStyle}>
                <DiscreteColorLegend
                    height={250}
                    width={300}
                    onItemClick={this._clickHandler}
                    items={this.state.items}
                    data={this.state.crosshairValues}
                />
                </div>
                )
            }
        }

    PopTable = () => {
        // console.log(this.props.legend)
        const { items, crosshairValues } = this.state
        const tmp = []
        const x = this.props.legend.map(a => a.HumanPlayerId.Gamertag)

        for (let i = 0; i < x.length; i++) {
            const player = x[i];
            tmp.push({
                [player]: this.state.unitData ? this.state.unitData[i] : []
            })
        }

        const titles = []

        for (const i of tmp) {
            for (const player in i) {
                const m = []
                if (i.hasOwnProperty(player)) {
                    const elem = i[player];
                    const data = this._objToString(elem);

                    const z = {
                        title: `${player} - ${data}`,
                        opacity: 1
                    }

                    titles.push(z)
                }
            }
        }


        return (
            <div className="legend" style={legendStyle}>
                <DiscreteColorLegend
                    height={250}
                    width={800}
                    onItemClick={this._clickHandler}
                    items={titles}
                    data={crosshairValues}
                />
            </div>
        )
    }

    _objToString = (data) => {
        if (data) {
            for (const [unit, count] of Object.entries(data)) {
                // console.log(unit, count)
            }
        }
    }

    render() {
        const {items, data, crosshairValues} = this.state;
        return (
            <AutoSizer defaultWidth={1000} disableHeight>
            {({ height, width }) => (
            <div>
            <div className="xyPlot" style={{
                display: 'inline-block',
                height: 300,
                width: width,
                maxWidth: 1000
            }}>
                <XYPlot height={300} width={width} onMouseLeave={this._onMouseLeave} onClick={this.props.popData ? this._onClick : null}>
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis title='Time (s)'/>
                    <YAxis title={this.props.title} tickLabelAngle={30} style={axisStyle}/>
                    {data.map((res, count) => <LineSeries animation data={res} key={count} onNearestX={this._onNearestX} opacity={items[count].opacity} curve={'curveMonotoneX'}/>)}
                    <Crosshair values={crosshairValues} style={crosshairStyle}>
                    <p/>
                    </Crosshair>
                </XYPlot>
            </div>
                <this.Legend/>
            </div>        
            )}
          </AutoSizer>
        )
    }
}

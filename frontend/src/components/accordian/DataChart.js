import React, { Component } from 'react';
import '../../../node_modules/react-vis/dist/style.css';
import { median } from "mathjs";
import DataPlots from './DataPlots';

export default class DataChart extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            
        }
    }

    setData = (data) => {
        this._prepData(data, "PlayerJoined")
        this._prepData(data, "ResourceHeartbeat")
        this._prepData(data, "UnitTrained")
    }
    
    _prepData = (data, eventName) => {
        this[eventName] = []
        switch (eventName) {
            case "ResourceHeartbeat":
            this.Resources = []
            const resources = data.MatchEvents[eventName].PlayerResources;
            delete resources.__typename
            for (const player in resources) {
                if (resources.hasOwnProperty(player)) {
                    const element = resources[player];
                    const z = this._getPlayerIndex(player, element);
                    if (z) {
                        this.Resources.push({
                            PlayerIndex: z.PlayerIndex,
                            Player: z.HumanPlayerId.Gamertag,
                            Leader: z.Leader.Name,
                            Resources: element
                        })        
                    }
                }
            }
            break;
            
            default:
            for (const res of data.MatchEvents[eventName]) {
                this[eventName].push(res);
            }
            // console.log(this[eventName])
            break;
        }
    }
    
    _getPlayerIndex = (P, resources) => {
        if (resources) {
            const playerIndex = P.charAt(1)
            const res = this.PlayerJoined.find(x => String(x.PlayerIndex) === playerIndex)
            // console.log(res)
            return res
        }
    }
    
    _setGraphData = (resourceName) => {
        let retRates = []
        let retTotals = []
        for (const event of this.Resources) {
            let totals = []
            for (let i = 0; i < event.Resources.length; i++) {
                const element = event.Resources[i];
                totals.push({
                    x: element.TimeSinceStartMilliseconds / 1000,
                    y: element[resourceName]
                })
            }
            const rates = this.getRates(totals);
            const smoothRates = this.smoothData(rates, 3);
            const smoothTotals = this.smoothData(totals, 3);
            retRates.push(smoothRates);
            retTotals.push(smoothTotals);
        }
        return [retRates, retTotals]
    }
    

    getRates = (data) => {
        let diffArr = []
        for (let i = 1; i < data.length; i++) {
            const prev = data[i-1];
            const curr = data[i];
            
            let dy = curr.y - prev.y
            let dx = curr.x - prev.x
            if (dx === 0) {dx = 5};
            
            let diff = dy/dx;
            
            diffArr.push({
                x: (prev.x + curr.x)/2,
                y: diff
            })
        }
        return diffArr
    }
    
    smoothData = (data, chunkSize) => {
        let val = [];
        
        const x = data.map(a => a.x)
        const y = data.map(a => a.y)
        const tmpx = this.chunk(x, chunkSize)
        const tmpy = this.chunk(y, chunkSize)
        
        for (let i = 0; i < tmpx.length; i++) {
            const _x = tmpx[i];
            const _y = tmpy[i];
            
            val.push({
                x: median(_x),
                y: median(_y)
            });
            
        }
        return val
    }
    
    chunk = (arr, chunkSize) => {
        var R = [];
        for (var i=0,len=arr.length; i<len; i+=chunkSize)
        R.push(arr.slice(i,i+chunkSize));
        return R;
    }
    
    render() {
        
        this.setData(this.props.data)

        const [SupplyRate, Supply] = this._setGraphData("TotalSupply")
        const [EnergyRate, Energy] = this._setGraphData("TotalEnergy")
        const [, cSupply] = this._setGraphData("Supply")
        const [, cEnergy] = this._setGraphData("Energy")
        const [, Population] = this._setGraphData("Population")

        return (
            <div>
            <DataPlots className='dataplot-show' data={Population} popData={this.UnitTrained} legend={this.PlayerJoined} title={'Population'}/>
            <DataPlots className='dataplot-show' data={SupplyRate} legend={this.PlayerJoined} title={'Supply Income Rate'}/>
            {/* <DataPlots className='dataplot-show' data={Supply} legend={this.PlayerJoined} title={'Total Supply'}/>
            <DataPlots className='dataplot-show' data={cSupply} legend={this.PlayerJoined} title={'Current Supply'}/>
            <DataPlots className='dataplot-show' data={EnergyRate} legend={this.PlayerJoined} title = {'Energy Income Rate'}/>
            <DataPlots className='dataplot-show' data={Energy} legend={this.PlayerJoined} title={'Total Energy'}/>
            <DataPlots className='dataplot-show' data={cEnergy} legend={this.PlayerJoined} title={'Current Energy'}/> */}
            {/* <DataPlots data={cEnergy} title = {'Current Energy'}/> */}
            </div>
            );
        }
    }
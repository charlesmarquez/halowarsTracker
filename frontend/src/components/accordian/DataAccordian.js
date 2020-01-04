import React, { Component } from 'react'
import { Accordion, Card, Button } from "react-bootstrap";
// import DataCard from "./DataCard";
import { Query } from 'react-apollo'
import { gql } from "apollo-boost";
import equal from 'fast-deep-equal'
import DataBody from './DataBody';
import DataCardHeader from './DataCardHeader';
import ModalComp from '../modal/ModalComp';

const CardQuery = gql`
query Player ($player: String! $count: String!){
  Player (player: $player count: $count) {
    MatchHistory{
			MatchId
      SeasonId
      MapId
      Playlist
      MapUrl
      LastOnline
      MapName
      PlayerMatchDuration
      PlayerIndex
      PlayerMatchOutcome
      PlayerCompletedMatch
    	MatchEvents {
        PlayerJoined {
          PlayerIndex
          HumanPlayerId {
            Gamertag
          }
          Leader {
            Name
          }
        }        
		UnitTrained {
          SquadId
          SquadName
          PlayerIndex
          Dies
          TimeTrained
          TimeDeath
          PopulationCost
		  SupplyCost
          EnergyCost
        }
        ResourceHeartbeat {
          PlayerResources {
            P1 {
              Supply
              Energy
              TotalSupply
              TotalEnergy
              Population
              TimeSinceStartMilliseconds
            }
            P2 {
              Supply
              Energy
              TotalSupply
              TotalEnergy
              Population
              TimeSinceStartMilliseconds
            }
            P3 {
              Supply
              Energy
              TotalSupply
              TotalEnergy
              Population
              TimeSinceStartMilliseconds
            }
            P4 {
              Supply
              Energy
              TotalSupply
              TotalEnergy
              Population
              TimeSinceStartMilliseconds
            }
            P5 {
              Supply
              Energy
              TotalSupply
              TotalEnergy
              Population
              TimeSinceStartMilliseconds
            }
            P6 {
              Supply
              Energy
              TotalSupply
              TotalEnergy
              Population
              TimeSinceStartMilliseconds
            }
          }
        }
      }
    }
    }
  }
`

export default class DataAccordian extends Component {
    
    constructor(props) {
      super(props)

      this.z = []
    
      this.state = {
        player: '',
        data: [],
		activekey: 0,
		checkedItems: {}
      }
    }

    componentDidMount = () => {
      this.setState({
        player: 'admiration'
      })
    }

    // componentWillReceiveProps = (nextProps) => {
    //   // console.log(nextProps, 'DataAccordian')
    //   this.setState({
    //     player: this.props.search
    //   })
    // }

    componentDidUpdate(prevProps) {
      if(!equal(this.props, prevProps)) 
      {
        this.setState({
          player: this.props.search
        })
      }
    } 

    // takes PlayerJoined Event
    _caseSensitiveName = (a) => {
      const {player} = this.state
      console.log(a)
      if (this.z.length) {
        const x = this.z.Player.MatchHistory[0].MatchEvents.PlayerJoined
        const c = x.find(x => x.HumanPlayerId.Gamertag.toLowerCase() === player)
        this.props.caseName(c.HumanPlayerId.Gamertag)
        console.log(c.HumanPlayerId.Gamertag)
      }
    }

    _handleClick = (event) => () => {
      this.setState({
        activekey: event
      })
	}
	


    render() {

      const {player, activekey, checkedItems} = this.state
    //   console.log(this.state)
        return (
            <Accordion>
            <Query query={CardQuery} variables={{
              player: player,
              count: "3"
            }}>
                
            {({ loading, error, data }) => {
                if (loading) return <div>Loading...</div>
                if (error) return <div>Error</div>

                return (
                    <div>
                    {data.Player.MatchHistory.map((match, count) =>
                    <Card key={count}>
                        <Card.Header>
                        <DataCardHeader data={match}/>
                        <br/>
                        <Accordion.Toggle as={Button} variant="link" eventKey={String(count)} onClick={this._handleClick(count)}>
                          Show Data 
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={String(count)}>                      
                        {activekey === count ? <DataBody data={match} key={count} checkedItems={checkedItems}></DataBody> : <div></div>}
                        </Accordion.Collapse>
                    </Card>
                    )}
                    </div>
                )
            }}
            </Query>
            </Accordion>
            
        )
    }
}

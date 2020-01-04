import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { gql } from "apollo-boost";

const testquery = gql`
query {
  Player (player: "Mike BEASTon" count: "2") {
    MatchHistory{
			MatchId
      MapId
      PlayerMatchDuration
      PlayerIndex
      PlayerMatchOutcome
      PlayerCompletedMatch
      }
    }
  }
`

export default class MatchQuery extends Component {
    render() {
        return (
            <Query query={testquery}>
                {({ loading, error, data }) => {
                    if (loading) return <div>Loading...</div>
                    if (error) return <div>Error</div>

                    console.log(data);

                    return (
                        <div>
                        {data.Player.MatchHistory.map(match => <div>{match.MatchId}</div>)}
                        </div>
                    )
                }}
            </Query>
        )
    }
}

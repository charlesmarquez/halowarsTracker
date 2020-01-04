import React, { Component } from 'react'
// import ReactTable from 'react-table'
import { Query } from 'react-apollo'
import gql from 'graphql-tag';

const LeaderboardQuery = gql`
query {
  Leaderboard (playlist: "1v1", count: 300)
}`



export default class HwTable extends Component {

    render() {

        return (
            <Query query={LeaderboardQuery}>
                {({ loading, error, data }) => {
                    if (loading) return <div>Loading...</div>
                    if (error) return <div>Error</div>

                    console.log(data);

                    return (
                        <div>
                        {/* {data.Player.MatchHistory.map(match => <div>{match.MatchId}</div>)} */}
                        
                        </div>
                    )
                }}
            </Query>
        )
    }
}

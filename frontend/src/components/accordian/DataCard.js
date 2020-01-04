import React, { Component } from 'react'
import { Accordion, Card, Button } from "react-bootstrap";
import { Query } from 'react-apollo'
import { gql } from "apollo-boost";

CardQuery = gql`
query {
  Player (player: "Mike BEASTon" count: "2") {
    MatchHistory{
			MatchId
      SeasonId
      MapId
      PlayerMatchDuration
      PlayerIndex
      PlayerMatchOutcome
      PlayerCompletedMatch
      }
    }
  }
`

export default class DataCard extends Component {
    render() {
        return (
            <Query query={CardQuery}>
            {({ loading, error, data }) => {
                if (loading) return <div>Loading...</div>
                if (error) return <div>Error</div>

                console.log(data);

                return (
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            Click me!ddddd
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>Hello! I'm the body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )
            }}
            </Query>
        )
    }
}

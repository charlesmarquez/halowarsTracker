import React, { Component } from 'react'
import DataAccordian from './DataAccordian'
import { Form, FormControl, Jumbotron, Button } from 'react-bootstrap'

const jumboStyle = {
    padding: 10
}

export default class DataHome extends Component {

    constructor(props) {
        super(props)
        this.textInput = React.createRef();
        this.state = {
            search: '',
            caseName: '',
            value: ''
        }
    }
    
    handleSearch = (state) => {
        if (this.state.search !== state.value) {
            this.setState({
                search: state.value
            })
        }
    }

    handleName = (state) => {
        console.log(state, 'handlename')
        this.setState({
            caseName: state
        })
    }
    
    handleChange() {
        /* 3. Get Ref Value here (or anywhere in the code!) */
        this.setState({
            value: this.textInput.current.value
        })
        // console.log(this)
    }

    handleClick = (e) => {
        e.preventDefault();
        this.setState({
          value: this.textInput.current.value
      })
    }

    jumbo = () => {
        return (
        <Jumbotron fluid style={jumboStyle}>
            <this.searchBar/>
        </Jumbotron> )
    }

    searchBar = () => {
        return (
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" ref={this.textInput}/>
            <Button variant="outline-info" onClick={(e) => this.handleClick(e)}>Search</Button>
          </Form>
        )
      }

    render() {

        const { value } = this.state

        return (
            <div>
                <this.jumbo/>
                <div>
                    <DataAccordian search={value} caseName={this.handleName}/>
                </div>
            </div>
        )
    }
}

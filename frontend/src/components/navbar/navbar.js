import React, { Component } from 'react'
import {Navbar, Nav, Form, FormControl, Button} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap"

export default class ReactNav extends Component {
	constructor(props) {
		super(props)
		this.textInput = React.createRef(); 
		this.state = {
			value: ''
		}
	}
	
	handleChange() {
		/* 3. Get Ref Value here (or anywhere in the code!) */
		this.setState({
			value: this.textInput.current.value
		})
	}
	
	updateParent = () => {
		this.props.search(this.state)
	}
	
	handleClick = (e) => {
		e.preventDefault();
		this.setState({
			value: this.textInput.current.value
		}, this.updateParent)
	}
	
	searchBar = () => {
		return (
			<Form inline>
			<FormControl type="text" placeholder="Search" className="mr-sm-2" ref={this.textInput} onChange={() => this.handleChange()}/>
			<Button variant="outline-info" onClick={(e) => this.handleClick(e)}>Search</Button>
			</Form>
			)
		}
		
		handleSelect = (x, z) => {
			console.log(x, z)
		}
		
		render() {
			return (
				<Navbar bg="dark" variant="dark">
				<Navbar.Brand href="#home">:)</Navbar.Brand>
				<Nav className="mr-auto" onSelect={this.handleSelect}>
				{/* <LinkContainer to="/home">
				<Nav.Link >Home</Nav.Link>
				</LinkContainer> */}
				<LinkContainer to="/tracker">
				<Nav.Link href="/tracker">Tracker</Nav.Link>
				</LinkContainer>
				{/* <LinkContainer to="/data">
				<Nav.Link href="/data">Data</Nav.Link>
				</LinkContainer> */}
				{/* <Nav.Link href="#pricing">{this.state.val}</Nav.Link> */}
				</Nav>
				{/* <this.searchBar/> */}
				</Navbar>
				)
			}
		}
		
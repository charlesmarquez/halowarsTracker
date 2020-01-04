import React, { PureComponent } from 'react'
import home from './components/home/home.js';
import DataHome from './components/accordian/DataHome';
import ReactNav from './components/navbar/navbar'
import Tracker from './components/tracker/Tracker';
import { BrowserRouter, Route } from "react-router-dom";
import { ApolloProvider } from 'react-apollo'

export default class App extends PureComponent {
    
    _handleNav = (state) => {
        console.log(state)
    }
    
    render() {
        return (
            <div className="App">
            <ApolloProvider client={this.props.client}>
            <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
            <Tracker/>
            </ApolloProvider>
            </div>
            )
        }
    }
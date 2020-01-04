import React from 'react';

// import SearchableDiscreteColorLegend from 'legends/searchable-discrete-color-legend';
import { DiscreteColorLegend } from "react-vis";

export default class DataLegend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      searchText: ''
    };
  }

  componentDidMount = () => {
    let items = this.state
    items = [];
    for (const player of this.props.data) {
        items.push({
          title: player.HumanPlayerId.Gamertag
        })
    }
    this.setState((state, props) => {
      return {items: items}
    })

  }

  _clickHandler = item => {
    const {items} = this.state;
    item.disabled = !item.disabled;
    this.setState({items});
  };

  _searchChangeHandler = searchText => {
    this.setState({searchText});
  };

  render() {
    const {items} = this.state;
    return (
      <DiscreteColorLegend
        height={400}
        width={300}
        onSearchChange={this._searchChangeHandler}
        onItemClick={this._clickHandler}
        items={items}
      />
    );
  }
}
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange }) => (
    <input type={type} name={name} checked={checked} onChange={onChange} />
  );

Checkbox.propTypes = {
type: PropTypes.string,
name: PropTypes.string.isRequired,
checked: PropTypes.bool,
onChange: PropTypes.func.isRequired,
}

const checkboxes = [
    {
      name: 'check-box-1',
      key: 'checkBox1',
      label: 'Check Box 1',
    },
    {
      name: 'check-box-2',
      key: 'checkBox2',
      label: 'Check Box 2',
    },
    {
      name: 'check-box-3',
      key: 'checkBox3',
      label: 'Check Box 3',
    },
    {
      name: 'check-box-4',
      key: 'checkBox4',
      label: 'Check Box 4',
    },
  ];

export default class CheckBoxes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: new Map(),
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
    this.props.data = this.state
  }

  render() {
    console.log(this.state)
    return (
      <React.Fragment>
        {
          checkboxes.map(item => (
            <Form.Check key={item.key}>
              <br/>
              {item.name}
              <Checkbox name={item.name} checked={this.state.checkedItems.get(item.name)} onChange={this.handleChange} />
            </Form.Check>
          ))
        }
      </React.Fragment>
    );
  }
}

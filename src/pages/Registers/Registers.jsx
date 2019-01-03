import React, { Component } from 'react';
import Register from './components/Register';

export default class Registers extends Component {
  static displayName = 'Registers';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="registers-page">
        <Register />
      </div>
    );
  }
}

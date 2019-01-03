import React, { Component } from 'react';
import TabChart from './components/TabChart';

export default class Page11 extends Component {
  static displayName = 'Page11';

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <div className="page11-page">
        <TabChart />
      </div>
    );
  }
}

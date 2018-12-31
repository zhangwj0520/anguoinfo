import React, { Component } from 'react';
import UserTable from './components/UserTable';

export default class Page19 extends Component {
  static displayName = 'Page19';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page19-page">
        <UserTable />
      </div>
    );
  }
}

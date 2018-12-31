import React, { Component } from 'react'
import { Button, Icon } from '@icedesign/base'
import IceContainer from '@icedesign/container'
import './BasicTab.scss'
export default class BasicTab extends Component {
  static displayName = 'BasicTab'
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      cols: [],
      newData: []
    }
  }
    static getDerivedStateFromProps(props, state) {
        if (props.data != state.data) {
            state.data= props.data;
            state.cols=props.cols,
            state.newData=props.data
    
          }
          return null
    }
  updateDate = (i, value) => {
    //console.log(i)
    const { newData } = this.state
    let newDate1 = JSON.parse(JSON.stringify(newData))
    //console.log(newDate1[i][7])
    newDate1[i][7] = value
    //console.log(newDate1[i])
    this.setState({
      newData: newDate1
    })
  }

  render() {
    const { data, cols, newData } = this.state
    const header = data[3]
    header ? (header[0] = '序号') : null

    return (
      <div className="basic-tab">
        <IceContainer style={styles.tabCardStyle}>
          <table className="table table-striped">
            <thead>
              <tr className="tableHead">
                {' '}
                {header
                  ? header.map((c, i) => {
                      return <th key={i}> {c} </th>
                    })
                  : null}{' '}
              </tr>{' '}
            </thead>{' '}
            <tbody className="tableBody">
              {' '}
              {newData.map((r, i) => {
                return (
                  <tr key={i}>
                    {' '}
                    {i > 3
                      ? cols.map((c, index) => (
                          <td key={c.key}>
                            {' '}
                            {index === 7 ? (
                              r[c.key] ? (
                                r[c.key]
                              ) : (
                                <Button type="primary" />
                              )
                            ) : (
                              r[c.key]
                            )}{' '}
                          </td>
                        ))
                      : null}{' '}
                  </tr>
                )
              })}{' '}
            </tbody>{' '}
          </table>{' '}
        </IceContainer>{' '}
      </div>
    )
  }
}

const styles = {
  tabCardStyle: {
    padding: 0
  }
}

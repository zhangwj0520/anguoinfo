import React, { Component } from 'react';
import { connect } from 'dva';
import './Page12.scss';
import IceContainer from '@icedesign/container';
import { withRouter } from 'react-router-dom';


const pySegSort = arr => {
    if (!String.prototype.localeCompare) return null;
    let letters = 'abcdefghjklmnopqrstwxyz'.split('');
    let zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('');
    let segs = [];
    letters.map((item, i) => {
      let cur = { letter: item, data: [] };
      arr.map(item => {
        if (item.localeCompare(zh[i]) >= 0 && item.localeCompare(zh[i + 1]) < 0) {
          cur.data.push(item);
        }
      });
      if (cur.data.length) {
        cur.data.sort(function(a, b) {
          return a.localeCompare(b, 'zh');
        });
        segs.push(cur);
      }
    });
    return segs;
  };

@connect(({ bund }) => ({
    bund,
  })) 
  @withRouter 
export default class Page12 extends Component {
  static displayName = 'Page12';

  constructor(props) {
    super(props);
    this.state = {
        data: [],
    };
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bund/fetchMedName',
    });
  }

  static getDerivedStateFromProps(props, state) {
    let data = props.bund.MedNameList;
    if (data.length != 0 && data !== state.data) {
      data = pySegSort(data);
      return {
        data,
      };
    }
    return null;
  }


  detail = name => {
    this.props.history.push(`/chart/medlist/curved/${name}`);
  };

  render() {
    const { data } = this.state;
    return (
      <div className="page12-page">
      <IceContainer>
      <h2>药品列表</h2>
          {data.length!=0?data.map((item, index) => {
            return (
              <dl key={index}>
                <dt key={index} className="letter">
                  {item.letter.toUpperCase()}
                </dt>
                {item.data.map((msg, index) => {
                  return (
                    <dd
                      key={index}
                      className="content"
                      onClick={() => this.detail(msg)}
                    >
                      {msg}
                    </dd>
                  );
                })}
              </dl>
            );
          }):null}
      </IceContainer>
       
      </div>
    );
  }
}

import React, {Component, Fragment} from 'react';
import IceContainer from '@icedesign/container';
import {Tab, Button, Feedback, Badge, DatePicker, Icon} from '@icedesign/base';
import moment from 'moment';
import CustomTable from './components/CustomTable';
import {withRouter} from 'react-router-dom';
import {btnAuthority} from '../../../../utils/authority';
import {connect} from 'dva';
import EditDialog from './components/EditDialog';
import DeleteBalloon from '../../../../components/DeleteBalloon';

const TabPane = Tab.TabPane;
const {toast} = Feedback;

const tabs = [{tab: '全部', key: 'all'}, {tab: '未报价', key: 'review'}];
const statusMap = ['未结算', '部分结算', '已结算'];

@connect (({bund}) => ({
  bund,
}))
@withRouter
export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor (props) {
    super (props);
    this.state = {
      dataSource: {},
      tabKey: 'all',
      data: [],
      editable: true,
    };
    this.columns = [
      {
        title: '序号',
        key: 'key',
        width: 60,
        render: (value, index, record) => index + 1,
      },
      {
        title: '订单编号',
        dataIndex: 'sn',
        width: 120,
        key: 'sn',
      },
      {
        title: '发货日期',
        dataIndex: 'fahuo_time',
        width: 120,
        key: 'fahuo_time',
        render: (text, index, record) => {
          if (record.editable) {
            return (
              <DatePicker
                onChange={data => this.onSave (data, index, record)}
                onOpenChange={e => this.onClose (e, index, record)}
                defaultOpen={true}
                size={'small'}
                defaultValue={record.fahuo_time}
                placeholder="发货日期"
              />
            );
          }
          return record.fahuo_time
            ? <span onClick={() => this.toggleEdit (record._id)}>
                {moment (record.fahuo_time).format ('YYYY-MM-DD')}
              </span>
            : <DatePicker
                onChange={data => this.onSave (data, index, record)}
                placeholder="发货日期"
              />;
        },
      },
      {
        title: '订单厂家',
        dataIndex: 'vender',
        width: 100,
        key: 'vender',
      },
      {
        title: '总订单金额(元)',
        dataIndex: 'dingdan_totalPrice',
        width: 120,
        key: 'dingdan_totalPrice',
      },
      {
        title: '总中标金额(元)',
        dataIndex: 'zhongbiao_totalPrice',
        width: 120,
        key: 'zhongbiao_totalPrice',
      },
      {
        title: '总采购金额(元)',
        dataIndex: 'caigou_totalPrice',
        key: 'caigou_totalPrice',
        width: 120,
      },
      {
        title: '已结算金额(元)',
        dataIndex: 'jiesuan_price',
        key: 'jiesuan_price',
        width: 120,
      },
      {
        title: '运费(元)',
        dataIndex: 'spend',
        key: 'spend',
        width: 100,
        render: (text, index, record) => (
          <a style={{color: '#FFCC00'}} onClick={() => this.spendList (record)}>
            {record.spend}
          </a>
        ),
      },
      {
        title: '结算状态',
        dataIndex: 'status',
        width: 100,
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
        ],
        render (text, index, record) {
          return (
            <Fragment>
              {statusMap[record.status]}
            </Fragment>
          );
        },
      },

      {
        title: '操作',
        width: 130,
        render: (text, index, record) => {
          return (
            <Fragment>
              <a
                style={{color: 'blue'}}
                onClick={() => this.detailList (record)}
              >
                订单详情
              </a>
              <span style={{marginLeft: '4px', marginRight: '4px'}}>|</span>
              <DeleteBalloon
                handleRemove={() => this.deleteLite (record._id)}
              />
            </Fragment>
          );
        },
      },
    ];
  }

  componentDidMount () {
    const {dispatch} = this.props;
    dispatch ({
      type: 'bund/fetch',
    });
  }

  static getDerivedStateFromProps (props, state) {
    if (props.bund.data.list !== state.data) {
      return {
        data: props.bund.data.list,
      };
    }
    return null;
  }

  //zwj
  toggleEdit = id => {
    const {data, editable} = this.state;
    if (editable) {
      const {target, key} = this.getRowByKey (id);
      data[key].editable = true;
      this.setState ({data, target, key, editable: false});
    } else {
      toast.prompt ('请先保存未完成的编辑任务!!!');
    }
  };

  getRowByKey (id) {
    const {data} = this.state;
    let target, key;
    data.map ((item, index) => {
      if (item._id === id) {
        target = item;
        key = index;
      }
    });
    return {target, key};
  }

  onClose = (e, index, record) => {
    if (!e) {
      let {data} = this.state;
      delete data[index].editable;
      this.setState ({data, editable: true});
    }
  };

  onSave = (date, index, record) => {
    const fahuo_time = date;
    const {dispatch} = this.props;
    dispatch ({
      type: 'bund/updateTime',
      payload: {id: record._id, fahuo_time},
    });
    this.setState ({target: {}, editable: true});
  };

  detailList = record => {
    this.props.history.push (`/bundlist/detail/${record._id}`);
  };
  spendList = record => {
    this.props.history.push (`/bundlist/spend/${record._id}`);
  };
  deleteLite = id => {
    const {dispatch} = this.props;
    dispatch ({
      type: 'bund/deleteList',
      payload: {id},
    });
  };

  getFormValues = (dataIndex, values) => {
    const {dataSource, tabKey} = this.state;
    dataSource[tabKey][dataIndex] = values;
    this.setState ({
      dataSource,
    });
  };

  handleRemove = (value, index) => {
    const {dataSource, tabKey} = this.state;
    dataSource[tabKey].splice (index, 1);
    this.setState ({
      dataSource,
    });
  };

  handleTabChange = key => {
    this.setState ({
      tabKey: key,
    });
  };

  render () {
    const {data} = this.state;
    return (
      <div className="tab-table">
        <IceContainer style={{padding: '0 20px 20px'}}>
          <CustomTable dataSource={data} columns={this.columns} />
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  contentText: {
    padding: '5px 0 15px',
  },
  icon: {
    color: '#2c72ee',
    cursor: 'pointer',
  },
  deleteIcon: {
    color: 'red',
    marginLeft: '20px',
  },
};

import React, { Component ,Fragment} from 'react';
import IceContainer from '@icedesign/container';
import { Tab,Button,Feedback,Badge } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import { withRouter } from 'react-router-dom';
import { btnAuthority } from '../../../../utils/authority';
import {Divider} from 'antd'
import { connect } from 'dva';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';

const TabPane = Tab.TabPane;
const { toast } = Feedback;

const tabs = [{ tab: '全部', key: 'all' }, { tab: '未报价', key: 'review' }];
const statusMap = ['未结算', '部分结算', '已结算'];

@connect(({ bund }) => ({
    bund,
  }))
@withRouter
export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
      tabKey: 'all',
      data:{}
    };
    this.columns = [
        {
          title: '序号',
          key: 'key',
          render: (value, index, record) => index+1,
        },
        {
          title: '订单编号',
          dataIndex: 'sn',
          key: 'sn',
        },
        {
          title: '发货日期',
          dataIndex: 'fahuo_time',
          editable: true,
          sorter: (a, b) => a.fahuo_time - b.fahuo_time,
          key: 'fahuo_time',
          render: (text, index,record) => {
            if (record.editable) {
              return (
                <DatePicker
                  //onOpenChange={status => this.onClear(status)}
                  onChange={data => this.onSave(data, record)}
                  // blur={this.onClear}
                  placeholder="发货日期"
                />
              );
            }
            return text ? (
              <span style={{ textAlign: Center }} onClick={this.toggleEdit(record._id)}>
                {moment(Number(text)).format('YYYY-MM-DD')}
              </span>
            ) : (
              <Button type="primary" onClick={this.toggleEdit(record._id)}>
                发货日期
              </Button>
            );
          },
        },
        {
          title: '订单厂家',
          dataIndex: 'vender',
          key: 'vender',
        },
        {
          title: '总订单金额(元)',
          dataIndex: 'dingdan_totalPrice',
          key: 'dingdan_totalPrice',
        },
        {
          title: '总中标金额(元)',
          dataIndex: 'zhongbiao_totalPrice',
          key: 'zhongbiao_totalPrice',
        },
        {
          title: '总采购金额(元)',
          dataIndex: 'caigou_totalPrice',
          key: 'caigou_totalPrice',
        },
        {
          title: '已结算金额(元)',
          dataIndex: 'jiesuan_price',
          key: 'jiesuan_price',
        },
        {
          title: '运费(元)',
          dataIndex: 'spend',
          key: 'spend',
          render:(text, index,record)=><Button type="secondary" onClick={() => this.spendList(record)}>{record.spend}</Button>
        },
        {
          title: '类别',
          dataIndex: 'venderType',
          key: 'venderType',
        },
        {
          title: '结算状态',
          dataIndex: 'status',
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
          render(val) {
            return <Badge status={statusMap[val]} text={status[val]} />;
          },
        },
    
        {
          title: '操作',
          width: 130,
          render: (text, index,record) => {
            //if(btnAuthority('delete')){
            if(1){
              return (
                <Fragment>
                  <Button type="primary" shape="warning" onClick={() => this.deleteLite(record._id)}>删除</Button>
                  <Button type="primary" onClick={() => this.detailList(record)}>品种详细</Button>
                </Fragment>
              )
            }else{
              return  (
                <Fragment>
                  <a onClick={() => this.detailList(record)}>品种详细</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.spendList(record)}>费用详细</a>
                </Fragment>
              )
            }
          }
    
        },
      ];
    
    
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bund/fetch',
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.bund.data.list !== state.data) {
      return {
        data: props.bund.data.list,
      };
    }
    return null;
  }

  //zwj
  toggleEdit=(id) =>{
    const { data, editable } = this.state;
    if (editable) {
      const { target, key } = this.getRowByKey(id);
      data[key].editable = true;
      this.setState({ data, target, key, editable: false });
    } else {
        toast.prompt('请先保存未完成的编辑任务!!!');
    }
  }

  detailList = record => {
    const { dispatch } = this.props;
    this.props.history.push(`/bundlist/detail/${record._id}`);
  };
  spendList = record => {
    const { dispatch } = this.props;
    this.props.history.push(`/bundlist/spend/${record._id}`);
  };
  deleteLite = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bund/deleteList',
      payload: { id },
    });
  };

  getFormValues = (dataIndex, values) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey][dataIndex] = values;
    this.setState({
      dataSource,
    });
  };

  handleRemove = (value, index) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey].splice(index, 1);
    this.setState({
      dataSource,
    });
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div className="tab-table">
        <IceContainer style={{ padding: '0 20px 20px' }}>
          <Tab onChange={this.handleTabChange}>
            {tabs.map((item) => {
              return (
                <TabPane tab={item.tab} key={item.key}>
                  <CustomTable
                    dataSource={data}
                    columns={this.columns}
                    hasBorder={false}
                  />
                </TabPane>
              );
            })}
          </Tab>
        </IceContainer>
      </div>
    );
  }
}

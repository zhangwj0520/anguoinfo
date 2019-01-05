import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab,Tag } from '@icedesign/base';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { connect } from 'dva';
import {auth} from '../../../../common/config';

const TabPane = Tab.TabPane;

const tabs = [{ tab: '全部', key: 'ok' }, { tab: '审核中', key: 'no' }];

@connect(({ user}) => ({
    user
  }))
export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        render: (text, index,record) => {
            return index + 1;
          },
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        width: 100,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: '允许登录',
        dataIndex: 'ok',
        key: 'ok',
        width: 100,
        render:(text, index,record)=>{
            let login=record.ok==="ok"?"是":"否"
            return <Tag size="small" color="#87d068" selected={true}>{login}</Tag>
        }
      },
      {
        title: '用户权限',
        dataIndex: 'currentAuthority',
        key: 'currentAuthority',
        width: 300,
        render: (text, index,record) => {
            return record.currentAuthority.map((item)=><Tag size="small" color="#87d068" selected={true}>{auth[item]}</Tag>)          
          },
      },
      {
        title: '注册时间',
        dataIndex: 'regTime',
        key: 'regTime',
        width: 150,
      },
      {
        title: '最后登录时间',
        dataIndex: 'lastLoginTime',
        key: 'lastLoginTime',
        width: 150,
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        render: (value, index, record) => {
          return (
            <span>
              <EditDialog
                record={record}
                getFormValues={this.getFormValues}
              />
              <DeleteBalloon
                handleRemove={() => this.handleRemove(record)}
              />
            </span>
          );
        },
      },
    ];
    this.state = {
        dataSource: {},
        tabKey: 'ok',
        cols:this.columns   
      };
  }

  componentDidMount() {
      const {dispatch}=this.props
      dispatch({
        type: 'user/fetchAllUsers',
      });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.user.allUsersData !== state.dataSource) {   
      return {
        dataSource:props.user.allUsersData
      };
    }
    return null;
  }

  getFormValues = (values) => {
    const {dispatch}=this.props
      dispatch({
        type: 'user/update',
        payload:values
      });
  };

  handleRemove = (values) => {
    const {dispatch}=this.props
    dispatch({
      type: 'user/delete',
      payload:values
    });
  };

  handleTabChange = (key) => {
      let cols=[]
    if(key==="ok"){
        cols=this.columns.filter((item)=>item)
    }else{
        cols=this.columns.filter((item)=>item.dataIndex!="currentAuthority")
    }
    this.setState({
      tabKey: key,
      cols
    });
  };

  render() {
    const { dataSource ,cols} = this.state;

    return (
      <div className="tab-table">
        <IceContainer style={{ padding: '0 20px 20px' }}>
          <Tab onChange={this.handleTabChange}>
            {tabs.map((item) => {
              return (
                <TabPane tab={item.tab} key={item.key}>
                  <CustomTable
                    dataSource={dataSource[this.state.tabKey]}
                    columns={cols}
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

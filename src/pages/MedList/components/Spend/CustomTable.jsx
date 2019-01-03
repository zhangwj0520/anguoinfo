/* eslint-disable react/no-unused-state, no-plusplus */
import React, { Component,Fragment } from 'react';
import { Table, Icon, Button, Input ,Grid,Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import DeleteBalloon from '../../../../components/DeleteBalloon';
import CustomBreadcrumb from '../../../../components/CustomBreadcrumb';

const { Row, Col } = Grid;
const { toast } = Feedback;
@withRouter
@connect(({ bund,loading }) => ({
    bund,loading
    //updatting: loading.effects['bund/updateOne'],
  }))
export default class CustomTable extends Component {
  static displayName = 'CustomTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
        data:[],
        id: this.props.match.params.id,
        loading: false,
        target: {},
        keys: 0,
        editable: true,
        total: 1,
        cols :[
            {
              title:'序号',
              dataIndex:'key',
              width: 80,
              render: (text,index,record) => {
                return index+1
              },
            },
            {
              title: '类别',
              dataIndex: 'type',
              width: 100,
              render: (text,index,record) => {
                if (record.editable) {
                  return (
                    <Input
                      defaultValue={record.type}
                      onChange={e => this.handleFieldChange(e, 'type', record.type)}
                      onKeyPress={e => this.handleKeyPress(e, record.type)}
                      placeholder="类别"
                    />
                  );
                }
                return record.type;
              },
            },
            {
              title: '费用',
              dataIndex: 'money',
              width: 150,
              render: (text,index,record) => {
                if (record.editable) {
                  return (
                    <Input
                      defaultValue={record.money}
                      onChange={e => this.handleFieldChange(e, 'money', record.money)}
                      onKeyPress={e => this.handleKeyPress(e, record.money)}
                      placeholder="费用"
                    />
                  );
                }
                return record.money;
              },
            },        
            {
              title: '备注',
              dataIndex: 'remark',
              width: 120,
              render: (text,index,record) => {
                if (record.editable) {
                  return (
                    <Input
                      multiple
                      defaultValue={record.remark}
                      onChange={e => this.handleFieldChange(e, 'remark', record.name)}
                      onKeyPress={e => this.handleKeyPress(e, record.name)}
                      placeholder="备注"
                    />
                  );
                }
                return record.remark||"无";
              },
            },        
            {
              title: '操作',
              key: 'action',
              width: 130,
              render: (text,index,record) => {           
                if (record.editable) {
                  if (record.isNew) {
                    return (
                      <Fragment>
                        <a onClick={() => this.saveRow()}>添加</a>
                        <span style={{marginLeft:"4px",marginRight:'4px'}}>|</span>
                        <a style={{color:"red"}} onClick={() => this.cancel()}>取消</a>

                      </Fragment>
                    );
                  }
                  return (
                    <Fragment>
                      <a onClick={() => this.saveRow()}>保存</a>
                      <span style={{marginLeft:"4px",marginRight:'4px'}}>|</span>
                      <a style={{color:"red"}} onClick={e => this.cancel()}>取消</a>
                    </Fragment>
                  );
                }
                return (
                  <Fragment>
                    <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
                    <span style={{marginLeft:"4px",marginRight:'4px'}}>|</span>
                    <DeleteBalloon
                        handleRemove={() => this.remove(record.key)}
                    />
                    </Fragment>
                );
              }
            }
          ]   
    };
  }


  componentDidMount() {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'bund/fetchSpend',
      payload:id
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (state.editable&&props.bund.spendList !== state.data) {
      return {
        data: props.bund.spendList,
      };
    }
    return null;
  }

  remove=(key)=> {
    const { data, id } = this.state;
    const spendList = data.filter(item => item.key !== key);
    const { dispatch } = this.props;
    dispatch({
      type: 'bund/updateSpend',
      payload:{id,spendList}
    });
    this.setState({ data: spendList, target: {}, editable: true });
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(value, fieldName) {
    let { target } = this.state;   
    target[fieldName] = value;
    this.setState({ target });
}


  getRowByKey(key) {
    const { data } = this.state;
    let target, keys;
    data.map((item, index) => {
      if (item.key === key) {
        target = item;
        keys = index;
      }
    });
    return { target, keys };
  }

  //编辑
  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data, editable } = this.state;
   if (editable) {
      const { target, keys } = this.getRowByKey(key);
      data[keys].editable = true;
      this.setState({ data, target, keys, editable: false });
    } else {
        toast.prompt('请先保存未完成的编辑任务!!!');
    }
  };

  saveRow() {
    let { data, target,keys, id } = this.state;
    let spendList = data.map(item => ({ ...item }));
    delete target.editable;
    delete target.isNew;
    spendList[keys] = target;
    const { dispatch } = this.props;

    dispatch({
      type: 'bund/updateSpend',
      payload:{id,spendList}
    });
    this.setState({target: {}, editable: true });
  }

  cancel() {
    let { data, target, key, editable } = this.state;
    let newData = data.map(item => ({ ...item }));
    delete target.editable;
    newData[key] = target;
    this.setState({ data: newData, target: {}, editable: true });
  }
  //添加
  newMember = () => {
    let { data,editable } = this.state;
    if (editable) {
      const newData = data.map(item => ({ ...item }));
      const keys=newData.length
      const target = {
        key:Math.floor(Math.random()*1000),
        editable: true,
        isNew: true,
        type:'',
        money:''
      };
      newData.push(target);
      this.setState({ data: newData,keys, target, editable: false });
    } else {
        toast.prompt('请先保存未完成的编辑任务!!!');
    }
  };


  renderColumns = () => {
    return this.state.cols.map((item) => {
      if (typeof item.render === 'function') {
        return (
          <Table.Column
            title={item.title}
            key={item.key}
            cell={item.render}
            width={item.width}
          />
        );
      }
      return (
        <Table.Column
          key={item.key}
          title={item.title}
          dataIndex={item.dataIndex}
          width={item.width}
        />
      );
    });
  };

  render() {
      const {data}=this.state;
      const breadcrumb = [
        { text: '首页', link: '#/' },
        { text: '账单列表', link: '#/bundlist' },
        { text: '费用详细', link: '' },
      ];
    return (
        <Fragment>
            <CustomBreadcrumb dataSource={breadcrumb} />
            <IceContainer title="费用明细列表">
                <Row wrap style={styles.headRow}>
                <Col l="12">
                    <Button type="primary" style={styles.button} onClick={this.newMember}>
                    <Icon type="add" size="xs" style={{ marginRight: '4px' }} />添加费用明细
                    </Button>
                </Col>
                </Row>
                <Table
                dataSource={data}
                >
                {this.renderColumns()}
                </Table>
            </IceContainer>
        </Fragment>
    );
  }
}

const styles = {
  headRow: {
    marginBottom: '10px',
  },
  icon: {
    color: '#2c72ee',
    cursor: 'pointer',
  },
  deleteIcon: {
    marginLeft: '20px',
  },
  center: {
    textAlign: 'right',
  },
  button: {
    borderRadius: '4px',
  },
  pagination: {
    marginTop: '20px',
    textAlign: 'right',
  },
};

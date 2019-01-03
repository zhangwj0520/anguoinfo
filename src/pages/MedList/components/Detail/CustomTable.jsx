/* eslint-disable react/no-unused-state, no-plusplus */
import React, { Component,Fragment } from 'react';
import { Table, Switch, Icon, Button, Grid, Pagination ,Input,Tag,Feedback,Dialog,Checkbox,Tab} from '@icedesign/base';
import {Divider,Popconfirm} from 'antd'
import IceContainer from '@icedesign/container';
import { btnAuthority } from '../../../../utils/authority';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import DeleteBalloon from '../../../../components/DeleteBalloon';
import CustomBreadcrumb from '../../../../components/CustomBreadcrumb';

const { Row, Col } = Grid;
const { toast } = Feedback;
const { Group } = Checkbox;
const TabPane = Tab.TabPane;
const tabs = [{ tab: '全部', key: 'all' }, { tab: '已中标', key: 'zhongbiao' }];

@withRouter
@connect(({ bund,loading }) => ({
    bund,
    loading: loading.effects['bund/fetchOne'],
  }))
export default class CustomTable extends Component {
  static displayName = 'CustomTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props); 
    this.state = {
      formValue: {},
      current: 1,//
      id: this.props.match.params.id,
      sourseData:[],
      data: [],
      width: '100%',
      loading: false,
      target: {},
      key: 0,
      editable: true,
      dataLen: 0,
      changeZhongbiao:false,
      cols:[],
      columns:[
        {
          title: '序号',
          dataIndex:'id',
          width: 65,
          render: (text, index,record) => {
            return index + 1;
          },
        },
        {
          title: '品名',
          dataIndex: 'name',
          key: 'name',
          width: 150,
          render: (value, index,record) => {
            if (record.isNew) {
              return (
                <Input
                  defaultValue={record.name}
                  onChange={e => this.handleFieldChange(e, 'name', record.name)}
                  onKeyPress={e => this.handleKeyPress(e, record.name)}
                  placeholder="品名"
                />
              );
            }
            if(this.state.changeZhongbiao){
                if (record.zhongbiao) {
                    return <Tag color="#87d068"  onSelect={(Bo)=>{this.changeZhongbiao(Bo,index)}}>{record.name}</Tag>;
                } else {
                    return <Tag color="magenta"  onSelect={(Bo)=>{this.changeZhongbiao(Bo,index)}}>{record.name}</Tag>;
                } 
            }else{
            if (record.zhongbiao) {
                return <Tag color="#87d068" selected={true}>{record.name}</Tag>;
            } else {
                return <Tag color="magenta" selected={false}>{record.name}</Tag>;
            }}
          
            },
         },
        {
          title: '产地',
          dataIndex: 'origin',       
          key: 'origin',
          width: 60,
          render: (text, index,record) => {
            if (record.isNew) {
              return (
                <Input
                  defaultValue={record.origin}
                  onChange={e => this.handleFieldChange(e, 'name', record.name)}
                  onKeyPress={e => this.handleKeyPress(e, record.name)}
                  placeholder="产地"
                />
              );
            }
            return record.origin;
          },
        },
        {
          title: '类别',
          dataIndex: 'type',       
          key: 'type',
          width: 70,
          render: (text, index,record) => {
            if (record.isNew) {
              return (
                <Input
                  defaultValue={record.type}
                  onChange={e => this.handleFieldChange(e, 'name')}
                  onKeyPress={e => this.handleKeyPress(e, record.name)}
                  placeholder="产地"
                />
              );
            }
            return record.type;
          },
        },
        {
          title: '品质及要求',
          dataIndex: 'description',
          key: 'description',      
          width: 300,
          render: (text,index,record) => {
            if (record.editable) {
              return (
                <Input
                    multiple
                  defaultValue={record.description}
                  onChange={e => this.handleFieldChange(e, 'remark')}
                  onKeyPress={e => this.handleKeyPress(e, record.name)}
                  placeholder="备注"
                />
              );
            }
            return record.description;
          },
        }, 
        {
          title: '计划采购量(Kg)',
          dataIndex: 'quantity',
          key: 'quantity',          
          width: 100,
          render: (text, index,record) => {
            if (record.isNew) {
              return (
                <Input
                  defaultValue={'0'}
                  onChange={e => this.handleFieldChange(e, 'quantity')}
                  onKeyPress={e => this.handleKeyPress(e, record.quantity)}
                  placeholder="计划采购量(Kg)"
                />
              );
            }
            return record.quantity;
          },
        },    
        {
          title: '订单单价(元)',
          dataIndex: 'dingdan_price',
          key: 'dingdan_price',        
          width: 100,
          render: (text, index,record) => {
            if (record.editable) {
              return (
                <Input
                  defaultValue={record.dingdan_price}
                  onBlur={e => this.handleFieldChange(e.target.value, 'dingdan_price', record.name)}
                  onKeyPress={e => this.handleKeyPress(e, record.name)}
                  placeholder="订单单价(元)"
                />
              );
            }
            return record.dingdan_price;
          },
        },
        {
          title: '采购单价(元)',
          dataIndex: 'caigou_price',
          key: 'caigou_price',          
          width: 100,
          render: (text, index,record) => {
            if (record.editable) {
              return (
                <Input
                  defaultValue={record.caigou_price}
                  onBlur={e => this.handleFieldChange(e.target.value, 'caigou_price')}
                 onKeyPress={e => this.handleKeyPress(e, record.name)}
                  placeholder="采购单价(元)"
                />
              );
            }
            return record.caigou_price;
          },
        },
        {
          title: '品种总订单价(元)',
          dataIndex: 'pingzhong_dingdan_totalPrice',
          key: 'pingzhong_dingdan_totalPrice',        
          width: 120,
          render: (text, index,record) => {
            return (record.dingdan_price * record.quantity).toFixed(2);
          },
        },
        {
          title: '品种总采购价(元)',
          dataIndex: 'pingzhong_caigou_totalPrice',
          key: 'pingzhong_caigou_totalPrice',
          
          width: 120,
          render: (text, index,record) => {
            if (record.zhongbiao) {
              return (record.caigou_price * record.quantity).toFixed(2);
            }
            return '未中标';
          },
        },
         {
          title: '已结算金额(元)',
          dataIndex: 'settlement',
          key: 'settlement',       
          width: 120,
          render: (text, index,record) => {
            if (record.jiesuan) {
              return (record.caigou_price * (record.quantity - record.back_quantity)).toFixed(2);
            }
            return '0';
          },
        },
        {
          title: '退尾料(Kg)',
          dataIndex: 'back_quantity',
          key: 'back_quantity',        
          width: 80,
          render: (text, index,record) => {
            if (record.editable && !record.isNew) {
              return (
                <Input
                  defaultValue={record.back_quantity}
                  onChange={e => this.handleFieldChange(e, 'back_quantity', record.back_quantity)}
                  onKeyPress={e => this.handleKeyPress(e, record.back_quantity)}
                  placeholder="退尾料(Kg)"
                />
              );
            }
            return record.back_quantity;
          },
        },
        {
          title: '是否结算',
          dataIndex: 'jiesuan',          
          width: 80,
          sorter: (a, b) => a.jiesuan - b.jiesuan,
          render: (text, index,record) => {
            if (record.editable) {
              return (
                <Switch
                  defaultChecked={Boolean(text)}
                  checkedChildren="是"
                  unCheckedChildren="否"
                  onChange={e => this.handleFieldChange(e, 'jiesuan', record.name)}
                />
              );
            }
            if (record.jiesuan) {
              return <Tag color="#87d068"  selected={true}>是</Tag>;
            } else {
              return <Tag color="magenta" onSelect={(Bo)=>{console.log(Bo)}} >否</Tag>;
            }
          },
        },
        // {
        //   title: '是否中标',
        //   dataIndex: 'zhongbiao',        
        //   width: 80,
        //   sorter: (a, b) => a.zhongbiao - b.zhongbiao,
        //   render: (text, index,record) => {
        //     if (record.editable && !record.isNew) {
        //       return (
        //         <Switch
        //           defaultChecked={Boolean(text)}
        //           checkedChildren="是"
        //           unCheckedChildren="否"
        //           onChange={e => this.handleFieldChange(e, 'zhongbiao', record.name)}
        //         />
        //       );
        //     }
        //     if (record.zhongbiao) {
        //       return <Tag color="#87d068" selected={true}>是</Tag>;
        //     } else {
        //       return <Tag color="magenta">否</Tag>;
        //     }
        //   },
        // },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 120,
          render: (text, index,record) => {
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
            return record.remark;
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',         
          width: 150,
          render: (text, index,record) => {
            const { loading } = this.state;
            if (!!record.editable && loading) {
              return null;
            }
            if (record.editable) {
              if (record.isNew) {
                return (
                    <Fragment>
                        <a onClick={e => this.saveRow(e, record.id)}>添加</a>
                        <span style={{marginLeft:"4px",marginRight:'4px'}}>|</span>
                        <DeleteBalloon
                            handleRemove={() => this.remove(record.id)}
                        />
                    </Fragment>
                );
              }
              return (
                <Fragment>
                    <a onClick={e => this.saveRow(e, record.id)}>保存</a>
                    <span style={{marginLeft:"4px",marginRight:'4px'}}>|</span>
                    <a style={{color:"red"}} onClick={e => this.cancel(e, record.id)}>取消</a>
                </Fragment>
              );
            }
            return (
                <Fragment>
                    <a onClick={e => this.toggleEditable(e, record.id)}>编辑</a>
                    <span style={{marginLeft:"4px",marginRight:'4px'}}>|</span>
                    <DeleteBalloon
                        handleRemove={() => this.remove(record.id)}
                    />
                </Fragment>
            );
          },
        },
      ]
    

    };
   
  }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
        type: 'bund/fetchOne',
        payload:this.state.id
        });
    }

  static getDerivedStateFromProps(props, state) {
      let cols=state.columns
    if (props.bund.oneListData !== state.sourseData) {
         if(props.bund.oneListData[0]){
             if(!props.bund.oneListData[0].origin){
                cols=cols.filter((item)=>item.dataIndex!="origin")
             }
             if(props.bund.oneListData[0].type==="无"){
                cols=cols.filter((item)=>item.dataIndex!="type")
             }
         }
      return {
        sourseData: props.bund.oneListData,
        data:props.bund.oneListData,
        dataLen:props.bund.oneListDataLen,
        cols
      };
    }
    return null;
  }

  changeZhongbiaoState=()=>{
      const {changeZhongbiao,data,id,zbData}=this.state;
      if(changeZhongbiao){
            const { dispatch } = this.props;
            dispatch({
            type: 'bund/updateOne',
            payload:{ data: zbData, id }
            });
            this.setState({changeZhongbiao:false,data:zbData})
      }else{
        let zbData = data.map(item => ({ ...item }));
        this.setState({changeZhongbiao:true,zbData})
      }
      
  }

  changeZhongbiao(Bo,index){
      const {zbData}=this.state;
      zbData[index].zhongbiao=Bo
  }


  openDialog = () => {
    Dialog.alert({
      needWrapper: false,
      content: this.renderControlContent(),
      title: "选择需要显示的列",
      onOk: () => {
        this.setState({
          cols: this.changedCols
        });
      }
    });
  };


  renderControlContent=()=> {
    const groupSource = this.state.cols.map(col => {
        return {
          label: col.title,
          value: col.dataIndex
        };
      });
     const  defaultValue = this.state.cols.map(col => col.dataIndex);
    return (
      <Group
        dataSource={groupSource}
        onChange={this.onChangeCols}
        defaultValue={defaultValue}
      />
    );
  }
  onChangeCols = value => {
    this.changedCols = this.state.cols.filter(col => value.indexOf(col.dataIndex) > -1);
  };


  remove(rowid) {
    const { data, id } = this.state;
    const newData = data.filter(item => item.id !== rowid);
    const { dispatch } = this.props;
    dispatch({
    type: 'bund/updateOne',
    payload:{ data: newData, id }
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.saveRow();
    }
  }

  handleFieldChange(value, fieldName) {
    let { target } = this.state;
    if (target) {
      if (fieldName == 'zhongbiao' || fieldName == 'jiesuan') {
        target[fieldName] = value ? 1 : 0;
      } else {
       target[fieldName] = Number(value);
      }
      this.setState({ target });
    }
  }

  getRowByKey(id) {
    const { data } = this.state;
    let target, key;
    //return  data.filter(item => item.name === name)[0];
    data.map((item, index) => {
      if (item.id === id) {
        target = item;
        key = index;
      }
    });
    return { target, key };
  }

  toggleEditable = (e, id) => {
    e.preventDefault();
    const { data, editable } = this.state;
    if (editable) {
      const { target, key } = this.getRowByKey(id);
      data[key].editable = true;
      this.setState({ data, target, key, editable: false });
    } else {
        toast.prompt('请先保存未完成的编辑任务!!!');
    }
  };

  saveRow() {
    let { data, target, key, id } = this.state;
    let newData = data.map(item => ({ ...item }));
    delete target.editable;
    delete target.isNew;
    newData[key] = target;
    const { dispatch } = this.props;
        dispatch({
        type: 'bund/updateOne',
        payload:{ data: newData, id }
        });
    this.setState({editable: true });
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
    let { data, total, editable } = this.state;

    if (editable) {
      const newData = data.map(item => ({ ...item }));
      const target = {
        id: total,
        name: '',
        editable: true,
        isNew: true,
        dingdan_price: 0,
        back_quantity: 0,
        caigou_price: 0,
        description: '',
        jiesuan: 0,
        origin: '',
        quantity: 0,
        settlement: 0,
        specifications: 0,
        zhongbiao: 1,
      };
      newData.unshift(target);

      const key = 0;
      total += 1;
      this.setState({ data: newData, target, total, key, editable: false });
    } else {
        toast.prompt('请先保存未完成的添加!!!');
    }
  };



  handlePaginationChange = (current) => {
    this.setState({
      current,
    });
  };

  //导出报价单	
  exportFile=()=> {
        const { dispatch } = this.props;
        const {id}=this.state
        dispatch({
        type: 'bund/exportFile',
        payload:id
        });
	};


  // 
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
      console.log(this.props.loading)
      const {data,changeZhongbiao}=this.state
      const zhongbiaoList = data.filter(item => item.zhongbiao);
      const breadcrumb = [
        { text: '首页', link: '#/' },
        { text: '账单列表', link: '#/bundlist' },
        { text: '账单详细列表', link: '' },
      ];
       return (
        <Fragment>
        <CustomBreadcrumb dataSource={breadcrumb} />
        <IceContainer title="账单详细列表">
            <Row wrap style={styles.headRow}>
            <Col l="12">
                <Button type="secondary" style={styles.button}  onClick={this.newMember}>
                <Icon type="add" size="xs" style={{ marginRight: '4px' }} />添加新品种
                </Button>        
                {!changeZhongbiao&&<Button type="primary" onClick={this.changeZhongbiaoState}>
                    <Icon type="add" size="xs" style={{ marginRight: '4px' }} />选择中标品种
       </Button> }
                {changeZhongbiao&&<Button type="primary" onClick={this.changeZhongbiaoState}>
                    保存中标品种
       </Button> }
                <Button onClick={this.openDialog}> 选择显示的列数 </Button>       
            </Col>
            
            <Col l="12" style={styles.center}>
                {/* <Button type="normal" style={styles.button}>
                删除
                </Button>
                <Button type="normal" style={{ ...styles.button, marginLeft: 10 }}>
                导入
                </Button> */}
                <Button type="primary" onClick={this.exportFile} style={{ ...styles.button, marginLeft: 10 }}>
                导出报价
                </Button>
            </Col>
            </Row>

            <Tab onChange={this.handleTabChange}>
                {tabs.map((item) => {
                return (
                    <TabPane tab={item.tab} key={item.key}>
                        <Table
                            isLoading={this.props.loading}
                            dataSource={item.key==="all"?data:zhongbiaoList}
                            // rowSelection={{ onChange: this.onChange }}
                            >
                            {/* {this.renderColumns()} */}
                            </Table>
                    </TabPane>
                );
                })}
            </Tab>
        
            {/* <Pagination
            style={styles.pagination}
            current={this.state.current}
            onChange={this.handlePaginationChange}
            /> */}
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
  button1: {
    borderRadius: '4px',
    marginLeft:"4px"
  },
  pagination: {
    marginTop: '20px',
    textAlign: 'right',
  },
};

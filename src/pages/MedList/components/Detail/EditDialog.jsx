import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field,Grid } from '@icedesign/base';
import { Chart, Axis, Geom, Tooltip } from 'bizcharts';
import { DataSet } from '@antv/data-set';
import { connect } from 'dva';


const FormItem = Form.Item;


@connect(({ bund }) => ({
    bund,
  }))
export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      chartData:[]
    };
    this.field = new Field(this);
  }
//   static getDerivedStateFromProps(props, state) {
//     if (props.bund.ChartList !== state.chartData) {
//       return {
//         chartData:props.bund.ChartList
//       };
//     }
//     return null;
//   }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      const { dataIndex } = this.state;
      this.props.getFormValues(dataIndex, values);
      this.setState({
        visible: false,
      });
    });
  };

  onOpen = (index, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bund/fetchOneMed',
      payload: { name: record.name,type:record.type},
    });
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      dataIndex: index,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const init = this.field.init;
    const { index, record,medName } = this.props;
    const {chartData}=this.state
    console.log(record)
    //console.log(chartData)
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
      const data = [
        { month: 'Jan', Tokyo: 7.0, London: 20 },
        { month: 'Feb', Tokyo: 6.9, London: 22 },
        { month: 'Mar', Tokyo: 9.5, London: 24 },
        { month: 'Apr', Tokyo: 14.5, London: 30 },
        { month: 'May', Tokyo: 18.4, London: 50 },
        { month: 'Jun', Tokyo: 21.5, London: 65 },
        { month: 'Jul', Tokyo: 25.2, London: 70 },
        { month: 'Aug', Tokyo: 26.5, London: 80 },
        { month: 'Sep', Tokyo: 23.3, London: 85 },
        { month: 'Oct', Tokyo: 18.3, London: 90 },
        { month: 'Nov', Tokyo: 13.9, London: 80 },
        { month: 'Dec', Tokyo: 9.6, London: 70 },
      ];
  
      // DataSet https://github.com/alibaba/BizCharts/blob/master/doc/tutorial/dataset.md#dataset
      const ds = new DataSet();
      const dv = ds.createView().source(data);
      dv.transform({
        type: 'fold',
        fields: ['Tokyo', 'London'],
        key: 'city',
        value: 'temperature',
      });
  
      // 定义度量
      const cols = {
        month: {
          range: [0, 1],
        },
      };
  

    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen(index, record)}
        >
          {medName}
        </Button>

        <Dialog
          style={{ width: "90vw" }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="编辑"
        >
              <Chart
          height={300}
          data={dv}
          scale={cols}
          forceFit
          padding={[40, 35, 40, 35]}
        >
          <Axis name="month" />
          <Axis name="temperature" label={{ formatter: (val) => `${val}` }} />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom
            type="line"
            position="month*temperature"
            size={2}
            color="city"
            shape="smooth"
          />
          <Geom
            type="point"
            position="month*temperature"
            size={4}
            shape="circle"
            color="city"
            style={styles.point}
          />
        </Chart>   
          <Form direction="ver" field={this.field}>
            <FormItem label="用户名：" {...formItemLayout}>
              <Input
              disabled
                {...init('name', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="邮箱：" {...formItemLayout}>
              <Input
                {...init('email', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="用户组：" {...formItemLayout}>
              <Input
                {...init('group', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            
          </Form>
        </Dialog>

      </div>
    );
  }
}

const styles = {
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
  },
};

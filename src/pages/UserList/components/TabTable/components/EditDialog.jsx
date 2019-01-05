import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field ,Select } from '@icedesign/base';

const FormItem = Form.Item;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.field = new Field(this);
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      this.props.getFormValues(values);
      this.setState({
        visible: false,
      });
    });
  };

  onOpen = (record) => {
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const init = this.field.init;
    const {record } = this.props;
    console.log(record)
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const dataSource = [
        {label:'游客', value:"0"},
        {label:'管理员', value:"1"},
        {label:'超级管理员', value:"2"}
    ]
    const dataSourceok = [
        {label:'是', value:"ok"},
        {label:'否', value:"no"},
    ]

    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen(record)}
        >
          编辑
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="编辑"
        >
          <Form direction="ver" field={this.field}>
            <FormItem label="用户名：" {...formItemLayout}>
              <Input
                disabled
                {...init('userName', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="姓名：" {...formItemLayout}>
              <Input
                {...init('name', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="允许登录：" {...formItemLayout}>
              <Select dataSource={dataSourceok}
                {...init('ok', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="用户权限：" {...formItemLayout}>
              <Select dataSource={dataSource}
                    multiple
                {...init('currentAuthority', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="注册时间：" {...formItemLayout}>
              <Input
                disabled
                {...init('regTime', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="最后登录时间：" {...formItemLayout}>
              <Input
                disabled
                {...init('lastLoginTime', {
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

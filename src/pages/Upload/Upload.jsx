import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import UploadExcel from './components/UploadExcel'
import { Upload, Button } from "@icedesign/base";
import './Upload.scss'

export default class Uploads extends Component {
  static displayName = 'Upload';

  constructor(props) {
    super(props);
    this.state = {};
  }

beforeUpload=(info)=> {
    console.log("beforeUpload callback : ", info);
  }
  
 onChange=(info)=> {
    console.log("onChane callback : ", info);
  }

  render() {

    const breadcrumb = [
        { text: '首页', link: '#/' },
        { text: '上传询价单', link: '#/upload' },
      ];
      return (
        <div className="upload-page">
          <CustomBreadcrumb dataSource={breadcrumb} />
          <UploadExcel />
        </div>
      );
  }
}

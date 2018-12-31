import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import UploadExcel from './components/UploadExcel'
import './Upload.scss'

export default class Upload extends Component {
  static displayName = 'Upload';

  constructor(props) {
    super(props);
    this.state = {};
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
    // return (
    //   <div className="my-tab-page" >
    //    <IceContainer>
    //    <Button type="primary" onClick={this.onClick}>
    //      <Icon type="atm" />主要按钮</Button> &nbsp;&nbsp;
    //      <SheetJSApp/>
    //     </IceContainer>
        
    //     {/* <BasicTab /> */}
    //   </div>
    // );
  }
}

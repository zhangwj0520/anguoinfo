import React, { Component } from 'react';
import TabTable from './components/TabTable';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import { connect } from 'dva';
import moment from 'moment';

@connect(({ bund }) => ({
    bund,
  }))
export default class MedList extends Component {
  static displayName = 'MedList';

  constructor(props) {
    super(props);
    this.state = {};
  }

//   componentDidMount() {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'bund/fetch',
//     });
//   }

//   static getDerivedStateFromProps(props, state) {
//     if (props.bund.data.list !== state.data) {
//       return {
//         data: props.bund.data.list,
//       };
//     }
//     return null;
//   }

  render() {
    const breadcrumb = [
        { text: '用户管理', link: '' },
        { text: '用户列表', link: '#/user/list' },
      ];
    return (
      <div className="med-list-page">
      <CustomBreadcrumb dataSource={breadcrumb} />
        <TabTable/>
      </div>
    );
  }
}

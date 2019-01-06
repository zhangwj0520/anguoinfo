import React, { Component } from "react";
import MedLists from "./components/MedList";
import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import { connect } from "dva";
import moment from "moment";

@connect(({ bund }) => ({
  bund
}))
export default class MedList extends Component {
  static displayName = "MedList";

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: "首页", link: "#/" },
      { text: "账单列表", link: "#/bundlist" }
    ];
    return (
      <div className="med-list-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <MedLists />
      </div>
    );
  }
}

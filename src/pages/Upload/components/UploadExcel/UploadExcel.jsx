import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import { Button, Icon } from "@icedesign/base";
import { Grid } from "@icedesign/base";
import XLSX from "xlsx";
import { connect } from "dva";
import BasicTab from "../BasicTab";
const { Row, Col } = Grid;

class UploadExcel extends Component {
  static UploadExcel = "UploadExcel";
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataSourse: [],
      cols: [] /* Array of column objects e.g. { name: "C", K: 2 } */,
      ws: {},
      baojiao_index: "" //报价的索引
    };
    // this.exportFile = this.exportFile.bind(this);
  }
  handleFile = file => {
    let outputs = []; //清空接收数据
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log(data);
      let flag = 0,
        i = 0,
        _medname,
        _vender,
        _orderid,
        _quantity = 0,
        _orederprice = 0,
        _buyprice = "",
        _iswin = "",
        _description = "",
        _specification = "",
        _origin = "",
        _type = "";
      if (data.length) {
        for (; i < 4; i++) {
          let cur = data[i];
          for (let [index, elem] of cur.entries()) {
            // 匹配订单编号
            if (/\u8ba2\u5355\u7f16\u53f7/g.exec(elem)) {
              _orderid = index;
              // this.setState({
              //   orderid: orderid[0],
              //   ordertime: orderid[1]
              // });
            }
            // 工厂名称
            // let vender = /\u5de5\u5382\u540d\u79f0/g.exec(elem);
            if (/\u5de5\u5382\u540d\u79f0/g.exec(elem)) {
              _vender = index;
              //    // 客户
              // if (/\u5ba2\u6237/g.test(vender)) {
              //   medtype = index;
              // }
              // this.setState({
              //   vender: vender[0]
              // });
            }
            // if (/^1$/g.test(elem)) {
            //   flag = i;
            // }
            // 品名
            if (/\u54c1\u540d/g.test(elem)) {
              //品名
              _medname = index;
              flag = i + 1;
            }
            // 采购量
            if (/\u91c7\u8d2d\u91cf/g.test(elem)) {
              //采购量
              _quantity = index;
            }
            // 单价
            if (/\u5355\u4ef7/g.test(elem)) {
              //单价
              _orederprice = index;
              // this.setState({
              //   baojiao_index: index
              // });
            }
            // 采购价
            if (/\u91c7\u8d2d\u4ef7/g.test(elem)) {
              //采购价
              _buyprice = index;
            }
            // 中标
            if (/\u4e2d\u6807/g.test(elem)) {
              _iswin = index;
            }
            // 品质及要求
            if (/\u54c1\u8d28\u53ca\u8981\u6c42/g.test(elem)) {
              _description = index;
            }
            // 规格
            if (/\u89c4\u683c/g.test(elem)) {
              _specification = index;
            }
            // 产地
            if (/\u4ea7\u5730/g.test(elem)) {
              _origin = index;
            }

            // // 是否结算
            // if (/\u662f\u5426\u7ed3\u7b97/g.test(elem)) {
            //   jiesuan = index;
            // }
          }
        }
      }
      let medVenderObj = {};
      for (let j = flag; j <= data.length - 1; j++) {
        let cur = data[j];
        if (cur.length === 0) break;
        if (!cur[_quantity]) continue;
        let medname = cur[_medname],
          orderid = cur[_orderid],
          ordertime = orderid.match(/\d+/g)[0],
          vender = cur[_vender],
          quantity = cur[_quantity] || 0,
          orderprice = cur[_orederprice] || 0,
          buyprice = cur[_buyprice] || 0,
          iswin = cur[_iswin] || 0,
          specification = cur[_specification] || "",
          origin = cur[_origin] || "",
          description = cur[_description] || "",
          type = "无";
        if (vender.indexOf("同仁堂") != -1) {
          type = "同仁堂";
          vender = "紫云腾";
        } else if (vender.indexOf("医院") != -1) {
          type = "医院";
          vender = "紫云腾";
        } else {
        }

        let orderObj = { orderid, vender, ordertime, medlist: [] };
        let medlist = {
          medname,
          quantity,
          orderid,
          orderprice,
          buyprice,
          iswin,
          specification,
          origin,
          description,
          type
        };
        if (medVenderObj[orderid]) {
          medVenderObj[orderid].medlist.push(medlist);
        } else {
          medVenderObj[orderid] = orderObj;
          medVenderObj[orderid].medlist.push(medlist);
        }
      }

      for (let key in medVenderObj) {
        medVenderObj[key].medlist = JSON.stringify(medVenderObj[key].medlist);
      }
      console.log(medVenderObj);

      outputs = Object.values(medVenderObj);
      // console.log(outputs);
      this.setState({
        fileName: file.name.split(".")[0],
        data: outputs,
        dataSourse: data,
        ws: ws,
        cols: make_cols(ws["!ref"])
      });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };
  onSave = () => {
    const { dispatch } = this.props;
    const { data } = this.state;
    dispatch({
      type: "file/upload",
      payload: { data }
    });
  };
  exportFile = () => {
    const ws = XLSX.utils.aoa_to_sheet(this.state.dataSourse);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    XLSX.writeFile(wb, "sheetjs.xlsx");
  };

  render() {
    const { dataSourse } = this.state;

    return (
      <div className="upload">
        <IceContainer>
          <Row gutter={8}>
            <Col style={styles.addFiles} span={4}>
              <Button style={styles.button} type="primary">
                <Icon type="add" />
                上传文件
              </Button>
              <input
                type="file"
                style={styles.input}
                accept={SheetJSFT}
                onChange={e => this.handleFile(e.target.files[0])}
              />
            </Col>
            <Col span={12} className={styles.btn_addPic}>
              {dataSourse.length ? (
                <Button type="primary" onClick={this.onSave}>
                  保存
                </Button>
              ) : null}
            </Col>
          </Row>
          {/* <div className="row"><div className="col-xs-12">
		            <button disabled={!this.state.dataSourse.length} className="btn btn-success" onClick={this.exportFile}>Export</button>
                </div></div> */}
          <OutTable data={this.state.dataSourse} cols={this.state.cols} />
        </IceContainer>
        {/* <BasicTab data={this.state.dataSourse} cols={this.state.cols}/> */}
      </div>
    );
  }
}
export default connect(({ file }) => ({ file }))(UploadExcel);

/*
  Simple HTML Table
  usage: <OutTable data={data} cols={cols} />
    data:Array<Array<any> >;
    cols:Array<{name:string, key:number|string}>;
*/
class OutTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {this.props.cols.map(c => (
                <th key={c.key}>{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((r, i) => (
              <tr key={i}>
                {this.props.cols.map(c => (
                  <td key={c.key}>{r[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

/* list of supported file types */
const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm"
]
  .map(function(x) {
    return "." + x;
  })
  .join(",");

/* generate an array of column objects */
const make_cols = refstr => {
  let o = [],
    C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};

const styles = {
  editDialog: {
    display: "inline-block",
    marginRight: "5px"
  },
  input: {
    display: "block",
    position: "relative",
    top: "-28px",
    left: 0,
    width: "110px",
    height: "28px",
    opacity: 0,
    filter: "alpha(opacity=0)"
  }
};

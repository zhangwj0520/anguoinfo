import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Button, Icon} from "@icedesign/base";
import { Grid } from '@icedesign/base';
import XLSX from 'xlsx';
import { connect } from 'dva';
import BasicTab from '../BasicTab'
const { Row, Col } = Grid;


@connect(({ file }) => ({ file }))
class UploadExcel extends Component {
    static UploadExcel = 'UploadExcel';
    constructor(props) {
		super(props);
		this.state = {
            data: [],
            dataSourse:[],
            cols: [],  /* Array of column objects e.g. { name: "C", K: 2 } */
            ws:{},
            baojiao_index:'',//报价的索引
		};
		// this.exportFile = this.exportFile.bind(this);
	};
	handleFile=(file)=> {
        const outputs = []; //清空接收数据
        //const outputs = {"无":[],"同仁堂":[],"医院":[]}; //清空接收数据
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
            let data = XLSX.utils.sheet_to_json(ws, {header:1});
           if (data.length) {
            let flag = 0,
              i = 0,
              name = 0,
              quantity = 0,
              dingdan_price = 0,
              caigou_price = '',
              zhongbiao = '',
              description = '',
              specifications = '',
              origin = '',
              type='';
            for (; i < 5; i++) {
              let cur = data[i];
              //console.log(cur)
            //   for (let m = 0; m < cur.length - 1; m++) {
            //     if (cur[m] == null) {
            //       cur[m] = 'null';
            //     }
            //   }
              for (let [index, elem] of cur.entries()) {
                // 匹配订单编号
                let sn = /[a-zA-Z]{2,3}(\d{8})$/g.exec(elem);
                if (sn) {
                  this.setState({
                    sn: sn[0],
                    dingdan_time: sn[1],
                  });
                }
                // 厂家
                let vender = /(\u5d07\u5149)|(\u91d1\u5d07\u5149)|(\u7d2b\u4e91\u817e)|(\u4e5d\u53d1)/g.exec(
                  elem
                );
                if (vender) {
                  this.setState({
                    vender: vender[0],
                  });
                }
                if (/^1$/g.test(elem)) {
                    flag = i;
                  }
                // 品名
                if (/\u54c1\u540d/g.test(elem)) {
                  name = index;
                }
                // 采购量
                if (/\u91c7\u8d2d\u91cf/g.test(elem)) {
                  quantity = index;
                }
                // 单价
                if (/\u5355\u4ef7/g.test(elem)) {
                  dingdan_price = index;
                  this.setState({
                    baojiao_index: index,
                  });
                }
                // 采购价
                if (/\u91c7\u8d2d\u4ef7/g.test(elem)) {
                  caigou_price = index;
                }
                // 中标
                if (/\u4e2d\u6807/g.test(elem)) {
                  zhongbiao = index;
                }
                // 品质及要求
                if (/\u54c1\u8d28\u53ca\u8981\u6c42/g.test(elem)) {
                  description = index;
                }
                // 规格
                if (/\u89c4\u683c/g.test(elem)) {
                  specifications = index;
                }
                // 产地
                if (/\u4ea7\u5730/g.test(elem)) {
                  origin = index;
                }
                // 客户
                if (/\u5ba2\u6237/g.test(elem)) {
                  type = index;
                }
                // // 是否结算
                // if (/\u662f\u5426\u7ed3\u7b97/g.test(elem)) {
                //   jiesuan = index;
                // }
              }
            }
            //console.log(`循环从${flag}开始`);
            for (let sheet in wb.Sheets) {
               let typev=sheet.indexOf("Sheet")!=0?sheet:null
                const wsss = wb.Sheets[sheet];
                let dataa = XLSX.utils.sheet_to_json(wsss, {header:1});
                for (let j = flag; j <= dataa.length - 1; j++) {
                    let cur = dataa[j]; 
                    if(cur.length===0) break     
                    let obj = {
                      key: cur[0],
                      name: cur[name],
                      quantity: cur[quantity],
                      dingdan_price: cur[dingdan_price]||0,
                      caigou_price: cur[caigou_price] || 0,
                      zhongbiao: cur[zhongbiao] || 0,
                      specifications: cur[specifications],
                      origin: cur[origin]||'',
                      description: cur[description],
                      type:cur[type]||typev||"无",
                      jiesuan:0, //结算
                      back_quantity: 0, //退尾料
                      settlement: 0, //
                      
                    };
                    outputs.push(obj);
                    //outputs[obj.type].push(obj);
                  }
            }
        
           }
            console.log(outputs)
			this.setState({ fileName:file.name.split('.')[0],data: outputs ,dataSourse: data,ws:ws, cols: make_cols(ws['!ref'])},);
		};
		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };
    onSave=()=>{
        const { dispatch } = this.props;
        const { dataSourse, sn, vender, dingdan_time,baojiao_index,cols ,data,fileName} = this.state;
        let values = { sn, vender,baojiao_index,cols ,data ,dataSourse,fileName,dingdan_time};
        values.key = sn;
        dispatch({
            type: 'file/upload',
            payload: values,
        });
    }
	exportFile=()=> {
        const ws = XLSX.utils.aoa_to_sheet(this.state.dataSourse);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, "sheetjs.xlsx")
	};

  render() {
    const {dataSourse}=this.state
    //console.log(this.state)

    return (
      <div className="upload">
        <IceContainer>
            <Row gutter={8}>
                <Col style={styles.addFiles}  span={4}>
                    <Button style={styles.button} type="primary">
                        <Icon type="add" />上传文件
                    </Button>
                    <input type="file" style={styles.input} accept={SheetJSFT} onChange={(e)=>this.handleFile(e.target.files[0])} />
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
export default UploadExcel




/*
  Simple HTML Table
  usage: <OutTable data={data} cols={cols} />
    data:Array<Array<any> >;
    cols:Array<{name:string, key:number|string}>;
*/
class OutTable extends React.Component {
	constructor(props) { super(props); };
	render() { return (
<div className="table-responsive">
	<table className="table table-striped">
		<thead>
			<tr>{this.props.cols.map((c) => <th key={c.key}>{c.name}</th>)}</tr>
		</thead>
		<tbody>
			{this.props.data.map((r,i) => <tr key={i}>
				{this.props.cols.map(c => <td key={c.key}>{ r[c.key] }</td>)}
			</tr>)}
		</tbody>
	</table>
</div>
	); };
};

/* list of supported file types */
const SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");

/* generate an array of column objects */
const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
	return o;
};


const styles = {
    editDialog: {
      display: 'inline-block',
      marginRight: '5px',
    },
    input:{
        display: "block",
        position: "relative",
        top: "-28px",
        left: 0,
        width: "110px",
        height: "28px",
        opacity: 0,
        filter: "alpha(opacity=0)",
    },
  };

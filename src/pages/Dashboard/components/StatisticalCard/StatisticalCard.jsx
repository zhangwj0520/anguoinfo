import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import { enquireScreen } from "enquire-js";
import { Balloon, Icon, Grid } from "@icedesign/base";
import { connect } from "dva";

const { Row, Col } = Grid;

class StatisticalCard extends Component {
  static displayName = "StatisticalCard";

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      sumData: {
        dingdan_tPrice: 0,
        zhongbiao_tPrice: 0,
        caigou_tPrice: 0,
        jiesuan_tPrice: 0
      }
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "bund/fetchAll"
    });
    this.enquireScreenRegister();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.bund.sumData != state.sumData) {
      return {
        sumData: props.bund.sumData
      };
    }
    return null;
  }

  enquireScreenRegister = () => {
    const mediaCondition = "only screen and (max-width: 720px)";

    enquireScreen(mobile => {
      this.setState({
        isMobile: mobile
      });
    }, mediaCondition);
  };

  renderItem = dataSource => {
    const itemStyle = this.state.isMobile ? { justifyContent: "left" } : {};
    return dataSource.map((data, idx) => {
      return (
        <Col xxs="24" s="12" l="6" key={idx}>
          <div style={{ ...styles.statisticalCardItem, ...itemStyle }}>
            <div style={styles.circleWrap}>
              <img src={data.imgUrl} style={styles.imgStyle} alt="图片" />
            </div>
            <div style={styles.statisticalCardDesc}>
              <div style={styles.statisticalCardText}>
                {data.text}
                <Balloon
                  align="t"
                  alignment="edge"
                  trigger={
                    <span>
                      <Icon type="help" style={styles.helpIcon} size="xs" />
                    </span>
                  }
                  closable={false}>
                  {data.desc}
                </Balloon>
              </div>
              <div style={styles.statisticalCardNumber}>{data.number}</div>
            </div>
          </div>
        </Col>
      );
    });
  };

  render() {
    const {
      dingdan_tPrice,
      zhongbiao_tPrice,
      caigou_tPrice,
      jiesuan_tPrice
    } = this.state.sumData;
    const dataSource = [
      {
        text: "订单总金额",
        number: dingdan_tPrice,
        imgUrl: require("./images/TB1tlVMcgmTBuNjy1XbXXaMrVXa-140-140.png"),
        desc: "所有询价单总报价金额"
      },
      {
        text: "总中标金额",
        number: zhongbiao_tPrice,
        imgUrl: require("./images//TB1Py4_ceuSBuNjy1XcXXcYjFXa-142-140.png"),
        desc: "所有厂家单总中标金额"
      },
      {
        text: "总采购金额",
        number: caigou_tPrice,
        imgUrl: require("./images/TB1Ni4_ceuSBuNjy1XcXXcYjFXa-142-140.png"),
        desc: "总采购金额"
      },
      {
        text: "总利润(未扣费用)",
        number: jiesuan_tPrice - caigou_tPrice,
        imgUrl: require("./images/TB1iFKccamWBuNjy1XaXXXCbXXa-140-140.png"),
        desc: "未扣除费用"
      }
    ];

    return (
      <IceContainer style={styles.container}>
        <Row wrap>{this.renderItem(dataSource)}</Row>
      </IceContainer>
    );
  }
}
export default connect(({ bund, loading }) => ({
  bund,
  loading: loading.effects["bund/fetchOne"]
}))(StatisticalCard);

const styles = {
  container: {
    padding: "10px 20px"
  },
  statisticalCardItem: {
    display: "flex",
    justifyContent: "center",
    padding: "10px 0"
  },
  circleWrap: {
    width: "70px",
    height: "70px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    marginRight: "10px"
  },
  imgStyle: {
    maxWidth: "100%"
  },
  helpIcon: {
    marginLeft: "5px",
    color: "#b8b8b8"
  },
  statisticalCardDesc: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  statisticalCardText: {
    position: "relative",
    color: "#333333",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "4px"
  },
  statisticalCardNumber: {
    color: "#333333",
    fontSize: "24px"
  },
  itemHelp: {
    width: "12px",
    height: "12px",
    position: "absolute",
    top: "1px",
    right: "-15px"
  }
};

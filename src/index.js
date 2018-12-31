import ReactDOM from "react-dom";
import dva from "dva";
import { message } from "antd";
// 载入默认全局样式 normalize 、.clearfix 和一些 mixin 方法等
import "@icedesign/base/reset.scss";
import "antd/dist/antd.css";
import router from "./router";
import createLoading from "dva-loading";

const ICE_CONTAINER = document.getElementById("ice-container");

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}

// ReactDOM.render(router, ICE_CONTAINER);
// 1. 创建应用，返回 dva 实例
const app = dva({
  //history: browserHistory(),
  onError(e) {
    message.error(e.message, /* duration */ 3);
  }
  // onAction: createLogger({}),
});

// 2. 配置 hooks 或者注册插件
app.use(createLoading());

// 3. 注册 model
// app.model(require("./models/global").default);

require("./models").default.forEach(key => app.model(key.default));

// 4. 注册路由表
app.router(router);

// 5. 启动应用
app.start(ICE_CONTAINER);

// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  {
    name: "首页",
    path: "/",
    icon: "home"
  },
  {
    name: "反馈",
    path: "https://github.com/alibaba/ice",
    external: true,
    newWindow: true,
    icon: "message"
  },
  {
    name: "帮助",
    path: "https://alibaba.github.io/ice",
    external: true,
    newWindow: true,
    icon: "bangzhu"
  }
];

const asideMenuConfig = [
  {
    name: "首页",
    path: "/",
    icon: "home"
  },
  {
    name: "账单列表",
    path: "/bundlist",
    icon: "ul-list"
  },
  {
    name: "订单录入",
    path: "/upload",
    icon: "publish"
  },
  {
    name: "用户管理",
    path: "/user",
    icon: "yonghu",
    children: [
      { name: "用户列表", path: "/user/list" },
      { name: "添加用户", path: "/user/create" },
      { name: "修改密码", path: "/user/pwd" }
    ]
  },
  //   {
  //     name: "Login",
  //     path: "/login",
  //     icon: "home"
  //   },
  //   {
  //     name: "\u6CE8\u518C",
  //     path: "/register",
  //     icon: "home"
  //   },
  {
    name: "药品列表",
    path: "/allmedname",
    icon: "cascades"
  }
];

export { headerMenuConfig, asideMenuConfig };

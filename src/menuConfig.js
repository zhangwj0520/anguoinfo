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
    name: "订单录入",
    path: "/upload",
    icon: "cascades"
  },
  {
    name: "账单类别",
    path: "/bundlist",
    icon: "home"
  },
  {
    name: "Nav19",
    path: "/page19",
    icon: "home"
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
  }
];

export { headerMenuConfig, asideMenuConfig };

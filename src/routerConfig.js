// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import HeaderAsideFooterResponsiveLayout from "./layouts/HeaderAsideFooterResponsiveLayout";
import BlankLayout from "./layouts/BlankLayout";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import CreateUser from "./pages/CreateUser";
import EditPassword from "./pages/EditPassword";
import NotFound from "./pages/NotFound";

import Upload from "./pages/Upload";
import MedList from "./pages/MedList";
import Detail from "./pages/MedList/components/Detail";

import Page19 from "./pages/Page19";
import Login from "./pages/Login";

const routerConfig = [
  {
    path: "/login",
    layout: BlankLayout,
    component: Login
  },
  {
    path: "/user",
    layout: HeaderAsideFooterResponsiveLayout,
    component: UserList,
    children: [
      {
        path: "list",
        layout: HeaderAsideFooterResponsiveLayout,
        component: UserList
      },
      {
        path: "create",
        layout: HeaderAsideFooterResponsiveLayout,
        component: CreateUser
      },
      {
        path: "pwd",
        layout: HeaderAsideFooterResponsiveLayout,
        component: EditPassword
      }
    ]
  },
  {
    path: "/",
    layout: HeaderAsideFooterResponsiveLayout,
    component: Dashboard
  },
  {
    path: "/upload",
    layout: HeaderAsideFooterResponsiveLayout,
    component: Upload
  },
  {
    path: "/bundlist",
    layout: HeaderAsideFooterResponsiveLayout,
    component: MedList
  },
  {
    path: "/bundlist/detail/:id",
    layout: HeaderAsideFooterResponsiveLayout,
    component: Detail
  },
  {
    path: "/page19",
    layout: HeaderAsideFooterResponsiveLayout,
    component: Page19
  },
  {
    path: "*",
    layout: HeaderAsideFooterResponsiveLayout,
    component: NotFound
  }
];

export default routerConfig;

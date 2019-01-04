// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import HeaderAsideFooterResponsiveLayout from './layouts/HeaderAsideFooterResponsiveLayout';
import BlankLayout from './layouts/BlankLayout';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import CreateUser from './pages/CreateUser';
import EditPassword from './pages/EditPassword';
import NotFound from './pages/NotFound';
import Upload from './pages/Upload';
import MedList from './pages/MedList';
import Detail from './pages/MedList/components/Detail';
import Spend from './pages/MedList/components/Spend';
import Registers from './pages/Registers';
import Page11 from './pages/Page11';
import Page12 from './pages/Page12';
import Login from './pages/Login';

const routerConfig = [
  {
    path: '/bundlist/spend/:id',
    layout: HeaderAsideFooterResponsiveLayout,
    component: Spend,
  },
  {
    path: '/user',
    layout: HeaderAsideFooterResponsiveLayout,
    component: UserList,
    children: [
      {
        path: 'list',
        layout: HeaderAsideFooterResponsiveLayout,
        component: UserList,
      },
      {
        path: 'create',
        layout: HeaderAsideFooterResponsiveLayout,
        component: CreateUser,
      },
      {
        path: 'pwd',
        layout: HeaderAsideFooterResponsiveLayout,
        component: EditPassword,
      },
    ],
  },
  {
    path: '/upload',
    layout: HeaderAsideFooterResponsiveLayout,
    component: Upload,
  },
  {
    path: '/bundlist',
    layout: HeaderAsideFooterResponsiveLayout,
    component: MedList,
  },
  {
    path: '/bundlist/detail/:id',
    layout: HeaderAsideFooterResponsiveLayout,
    component: Detail,
  },
  {
    path: '/',
    layout: HeaderAsideFooterResponsiveLayout,
    component: Dashboard,
  },
  {
    path: '/login',
    layout: BlankLayout,
    component: Login,
  },
  {
    path: '/register',
    layout: BlankLayout,
    component: Registers,
  },
  {
    path: '/page11',
    layout: HeaderAsideFooterResponsiveLayout,
    component: Page11,
  },
  {
    path: '/page12',
    layout: HeaderAsideFooterResponsiveLayout,
    component: Page12,
  },
  {
    path: '*',
    layout: HeaderAsideFooterResponsiveLayout,
    component: NotFound,
  },
];

export default routerConfig;

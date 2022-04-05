// import { Navigate } from 'react-router-dom'
// import AuthCompontent from '../views/AuthCompontent/AuthCompontent'
// import Login from '../views/login/Login'
// import SandBox from '../views/sandbox/SandBox'
// import Home from '../views/sandbox/home/Home'
// import UserList from '../views/sandbox/user-manage/UserList'
// import RoleList from '../views/sandbox/right-manage/RoleList'
// import RightList from '../views/sandbox/right-manage/RightList'
// import NewsAdd from '../views/sandbox/news-manage/NewsAdd'
// import NewsDraft from '../views/sandbox/news-manage/NewsDraft'
// import NewsCategory from '../views/sandbox/news-manage/NewsCategory'
// import Audit from '../views/sandbox/audit-manage/Audit'
// import AuditList from '../views/sandbox/audit-manage/AuditList'
// import UnPublished from '../views/sandbox/publish-manage/UnPublished'
// import Published from '../views/sandbox/publish-manage/Published'
// import Sunset from '../views/sandbox/publish-manage/Sunset'

// import './test'
// // 本地路由映射表
// const localRoutes = {
//   '/home': <Home />, // 首页
//   '/user-manage/list': <UserList />, // 用户列表
//   '/right-manage/role/list': <RoleList />, // 角色列表
//   '/right-manage/right/list': <RightList />, // 权限列表
//   '/news-manage/add': <NewsAdd />, // 撰写新闻
//   '/news-manage/draft': <NewsDraft />, // 草稿箱
//   '/news-manage/category': <NewsCategory />, // 新闻分类
//   '/audit-manage/audit': <Audit />, // 新闻审核
//   '/audit-manage/list': <AuditList />, // 审核列表
//   '/publish-manage/unpublished': <UnPublished />, // 待发布
//   '/publish-manage/published': <Published />, // 已发布
//   '/publish-manage/sunset': <Sunset /> // 已下线
// }

// const routes = [
//   // 登录页
//   { path: '/login', element: <Login /> },
//   // 处理跳转不存在的路由-跳转首页
//   { path: '*', element: <Navigate to="/" /> },
//   // 首页
//   {
//     path: '/',
//     // <AuthCompontent> 配置路由拦截
//     element: (
//       <AuthCompontent>
//         <SandBox />
//       </AuthCompontent>
//     ),
//     // 子路由，路由嵌套
//     children: [
//       // 路由重定向-设置默认子路由
//       { path: '/', element: <Navigate to="home" /> },
//       // 首页
//       { path: 'home', element: <Home /> },
//       // 用户管理-用户列表
//       { path: 'user-manage/list', element: <UserList /> },
//       // 权限列表-角色列表
//       { path: 'right-manage/role/list', element: <RoleList /> },
//       // 权限列表-权限列表
//       { path: 'right-manage/right/list', element: <RightList /> }
//     ]
//   }
// ]

// export default routes

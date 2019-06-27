export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
            authority: ['admin'],
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
            authority: ['admin'],
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        path: '/system',
        icon: 'appstore',
        name: 'system',
        routes: [
          {
            path: '/system/deptlist',
            name: 'deptment',
            component: './System/DeptList',
          },
          {
            path: '/system/modulelist',
            name: 'module',
            component: './System/ModuleList',
          },
          {
            path: '/system/rolelist',
            name: 'role',
            component: './System/RoleList',
          },
          {
            path: '/system/userlist',
            name: 'user',
            component: './System/UserList',
          },
        ],
      },
    ],
  },
];

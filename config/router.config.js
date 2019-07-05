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
      { path: '/', redirect: '/workplace' },
      {
        path: '/workplace',
        name: 'workplace',
        icon: 'desktop',
        component: './Dashboard/Workplace',
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
        path: '/org',
        icon: 'apartment',
        name: 'org',
        routes: [
          {
            path: '/org/organization',
            name: 'organization',
            component: './Organization/Organization/OrgList',
          },
        ],
      },
      //内部管理 这个节点是另外一个系统的
      {
        path: '/inner',
        icon: 'bank',
        name: 'inner',
        routes: [
          {
            path: '/inner/deptlist',
            name: 'deptment',
            component: './InnerManager/Deptment/DeptList',
          },
        ],
      },
      {
        path: '/system',
        icon: 'setting',
        name: 'system',
        routes: [
          {
            path: '/system/modulelist',
            name: 'module',
            component: './System/Module/ModuleList',
          },
          {
            path: '/system/rolelist',
            name: 'role',
            component: './System/Role/RoleList',
          },
          {
            path: '/system/userlist',
            name: 'user',
            component: './System/User/UserList',
          },
        ],
      },
    ],
  },
];

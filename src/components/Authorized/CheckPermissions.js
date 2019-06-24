import React from 'react';
// eslint-disable-next-line import/no-cycle
import PromiseRender from './PromiseRender';
import { CURRENT } from './renderAuthorize';

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 | Permission judgment } authority
 * @param { 你的权限 | Your permission description } currentAuthority
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority || authority === 'guest') {
    return target;
  }

  if (currentAuthority.proUserType.some(item => item === 'admin')) {
    return target;
  }

  const { path } = target;

  // Promise 处理
  if (authority instanceof Promise) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />;
  }
  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority);
      // 函数执行后返回值是 Promise
      if (bool instanceof Promise) {
        return <PromiseRender ok={target} error={Exception} promise={bool} />;
      }
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }

  if (Array.isArray(currentAuthority.proPermission)) {
    if (currentAuthority.proPermission.some(item => path === item)) {
      return target;
    }
  } else if (path === currentAuthority.proPermission) {
    return target;
  }
  return Exception;
};

export { checkPermissions };

const check = (authority, target, Exception) =>
  checkPermissions(authority, CURRENT, target, Exception);

export default check;

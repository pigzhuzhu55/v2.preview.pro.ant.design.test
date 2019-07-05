import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

/**
 * 登录
 */

export async function fakeAccountLogin(params) {
  return request('/api/none/sign/in', {
    method: 'POST',
    data: params,
  });
}

/**
 * 部门管理
 */
export async function getDeptChildren(id) {
  return request(`/api/v1/deptment/treeNodes?id=${id}`);
}
export async function getDeptList(params) {
  return request(`/api/v1/deptment/list?${stringify(params)}`);
}
export async function getDeptAllList() {
  return request(`/api/v1/deptment/allList`);
}
export async function getDeptAllCascaders() {
  return request(`/api/v1/deptment/allCascaders`);
}
export async function removeDept(params) {
  return request('/api/v1/deptment/remove', {
    method: 'POST',
    data: params,
  });
}

/**
 * 权限模块管理
 */
export async function getModuleChildren(id) {
  return request(`/api/v1/module/treeNodes?id=${id}`);
}
export async function getModuleList(params) {
  return request(`/api/v1/module/list?${stringify(params)}`);
}
export async function removeModule(params) {
  return request('/api/v1/module/remove', {
    method: 'POST',
    data: params,
  });
}

/**
 * 角色模块管理
 */
export async function getRoleList(params) {
  return request(`/api/v1/role/list?${stringify(params)}`);
}

/**
 * 用户模块
 */

export async function getUserList(params) {
  return request(`/api/v1/user/list?${stringify(params)}`);
}

export async function removeUser(params) {
  return request('/api/v1/user/remove', {
    method: 'POST',
    data: params,
  });
}

/**
 * 组织结构管理
 */
export async function getOrganizationList(params) {
  return request(`/api/v1/organization/list?${stringify(params)}`);
}

export async function removeOrganization(params) {
  return request('/api/v1/organization/remove', {
    method: 'POST',
    data: params,
  });
}

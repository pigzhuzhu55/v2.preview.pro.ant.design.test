import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/none/sign/in', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

/**
 * 组织管理
 */
export async function getDeptChildren(id) {
  return request(`/api/v1/organization/treeNodes?id=${id}`);
}
export async function getDeptList(params) {
  return request(`/api/v1/organization/list?${stringify(params)}`);
}
export async function removeDept(params) {
  return request('/api/v1/organization/remove', {
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

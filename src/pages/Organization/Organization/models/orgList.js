import {
  getOrganizationList,
  removeOrganization,
  saveOrganization,
  getProvinceList,
  getCityList,
  getCountyList,
} from '@/services/api';

export default {
  namespace: 'orgList',

  state: {
    listData: {
      list: [],
      pagination: {},
    },
    proviceData: [],
  },

  effects: {
    *listLoad({ payload }, { call, put }) {
      const response = yield call(getOrganizationList, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeOrganization, payload);
      if (callback) callback();
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveOrganization, payload);
      if (callback) callback(response);
    },
    *listProvince({ payload, callback }, { call }) {
      const response = yield call(getProvinceList, payload);
      if (callback) callback(response);
    },
    *listCity({ payload, callback }, { call }) {
      const response = yield call(getCityList, payload);
      if (callback) callback(response);
    },
    *listCounty({ payload, callback }, { call }) {
      const response = yield call(getCountyList, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    loadList(state, action) {
      const { data: list, pagination } = action.payload;

      return {
        ...state,
        listData: {
          list,
          pagination,
        },
      };
    },
  },
};

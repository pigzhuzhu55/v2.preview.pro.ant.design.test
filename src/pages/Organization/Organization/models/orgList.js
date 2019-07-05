import { getOrganizationList, removeOrganization } from '@/services/api';

export default {
  namespace: 'orgList',

  state: {
    listData: {
      list: [],
      pagination: {},
    },
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

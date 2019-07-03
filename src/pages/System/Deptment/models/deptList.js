import { getDeptChildren, getDeptAllList, removeDept } from '@/services/api';

export default {
  namespace: 'deptList',

  state: {
    list: [],
  },

  effects: {
    *listLoad({ payload }, { call, put }) {
      const response = yield call(getDeptAllList, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeDept, payload);
      if (callback) callback();
    },
  },

  reducers: {
    loadList(state, action) {
      const { data: list } = action.payload;

      return {
        ...state,
        list,
      };
    },
  },
};

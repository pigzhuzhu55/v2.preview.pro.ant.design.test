import { getDeptAllCascaders, getDeptAllList, removeDept } from '@/services/api';

export default {
  namespace: 'deptList',

  state: {
    list: [],
    residences: [],
  },

  effects: {
    *listLoad({ payload }, { call, put }) {
      const response = yield call(getDeptAllList, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },
    *cascadersLoad({ payload }, { call, put }) {
      const response = yield call(getDeptAllCascaders, payload);
      yield put({
        type: 'loadCascaders',
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
    loadCascaders(state, action) {
      const { data: residences } = action.payload;

      return {
        ...state,
        residences,
      };
    },
  },
};

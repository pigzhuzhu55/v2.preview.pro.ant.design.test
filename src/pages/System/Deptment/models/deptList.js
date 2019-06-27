import { getDeptChildren, getDeptList, removeDept } from '@/services/api';

export default {
  namespace: 'deptList',

  state: {
    treeData: [],
    listData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *treeLoad({ payload, callback }, { call, put }) {
      const response = yield call(getDeptChildren, payload.id);
      yield put({
        type: 'loadTree',
        payload: response,
      });
      if (callback) callback();
    },

    *listLoad({ payload }, { call, put }) {
      const response = yield call(getDeptList, payload);
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
    loadTree(state, action) {
      return {
        ...state,
        treeData: action.payload.data,
      };
    },
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

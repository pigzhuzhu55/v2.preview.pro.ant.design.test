import { getDeptChildren } from '@/services/api';

export default {
  namespace: 'deptList',

  state: {
    treeData: [],
    listData:  {
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
      callback();
    },
  },

  reducers: {
    loadTree(state, action) {
      return {
        ...state,
        treeData: action.payload.data,
      };
    },
  },
};

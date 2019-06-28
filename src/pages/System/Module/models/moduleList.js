import { getModuleChildren, getModuleList, removeModule } from '@/services/api';

export default {
  namespace: 'moduleList',

  state: {
    treeData: [],
    listData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *treeLoad({ payload, callback }, { call, put }) {
      const response = yield call(getModuleChildren, payload.id);
      yield put({
        type: 'loadTree',
        payload: response,
      });
      if (callback) callback();
    },

    *listLoad({ payload }, { call, put }) {
      const response = yield call(getModuleList, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeModule, payload);
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

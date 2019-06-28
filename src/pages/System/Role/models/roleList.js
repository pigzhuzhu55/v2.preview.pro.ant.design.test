import { getRoleList } from '@/services/api';

export default {
  namespace: 'roleList',
  state: {
    listData: [],
  },

  effects: {
    *listLoad({ payload }, { call, put }) {
      const response = yield call(getRoleList, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },
  },

  reducers: {
    loadList(state, action) {
      const { data: list } = action.payload;

      return {
        ...state,
        listData: list,
      };
    },
  },
};

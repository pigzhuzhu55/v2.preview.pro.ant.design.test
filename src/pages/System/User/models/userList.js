import { getUserList, removeUser } from '@/services/api';

export default {
  namespace: 'userList',

  state: {
    listData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *listLoad({ payload }, { call, put }) {
      const response = yield call(getUserList, payload);
      yield put({
        type: 'loadList',
        payload: response,
      });
    },

    *remove({ payload, callback }, { call }) {
      yield call(removeUser, payload);
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

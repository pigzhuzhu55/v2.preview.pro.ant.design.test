import { query as queryUsers, queryCurrent } from '@/services/user';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });

      if (response.code === 1) {
        yield put(routerRedux.replace({ pathname: '/user/login' }));
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload.data,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.data.totalCount,
          unreadCount: action.payload.data.unreadCount,
        },
      };
    },
  },
};

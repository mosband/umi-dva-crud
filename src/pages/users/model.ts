import { Effect, ImmerReducer, Subscription } from 'umi';
import { request } from 'umi';

export interface UsersModelState {
  items: Array<any>;
}

export interface UsersModelType {
  namespace: 'users';
  state: UsersModelState;
  effects: {
    queryItems: Effect;
  };
  reducers: {
    setItems: ImmerReducer<UsersModelState>;
  };
  subscriptions: { setup: Subscription };
}

const UsersModel: UsersModelType = {
  namespace: 'users',
  state: {
    items: [],
  },
  effects: {
    *queryItems({ payload }, { call, put }) {
      const data = yield call(() => {
        return request('http://public-api-v1.aspirantzhang.com/users', {
          method: 'get',
        })
          .then(res => {
            return res.data;
          })
          .catch(() => []);
      });
      yield put({
        type: 'setItems',
        payload: data,
      });
    },
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload || [];
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'queryItems',
          });
        }
      });
    },
  },
};

export default UsersModel;

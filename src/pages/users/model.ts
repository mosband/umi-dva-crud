import { Effect, ImmerReducer, Subscription } from 'umi';
import { extend } from 'umi-request';

const errorHandler = function(error: {
  response: { status: any };
  data: any;
  message: any;
}) {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.data);
  } else {
    console.log(error.message);
  }

  throw error;
};

const request = extend({ errorHandler });

import { message } from 'antd';

export interface UsersModelState {
  items: Array<any>;
  total: number;
}

export interface UsersModelType {
  namespace: 'users';
  state: UsersModelState;
  effects: {
    queryItems: Effect;
    editItem: Effect;
    deleteItem: Effect;
  };
  reducers: {
    setItems: ImmerReducer<UsersModelState>;
    setTotal: ImmerReducer<UsersModelState>;
  };
  subscriptions: { setup: Subscription };
}

const UsersModel: UsersModelType = {
  namespace: 'users',
  state: {
    items: [],
    total: 0,
  },
  effects: {
    *queryItems({ payload }, { call, put }) {
      const data = yield call(() => {
        return request('/api/users', {
          method: 'get',
        })
          .then(res => {
            return {
              items: res.data || [],
              total: res.meta.total || 0,
            };
          })
          .catch(() => []);
      });
      yield put({
        type: 'setItems',
        payload: data.items,
      });
      yield put({
        type: 'setTotal',
        payload: data.total,
      });
    },
    *editItem({ payload }, { call, put }) {
      const { values, id } = payload;
      const data = yield call(() => {
        return request(`/api/users/${id}`, {
          method: 'put',
          data: values,
        })
          .then(() => true)
          .catch(() => false);
      });
      if (data) {
        message.success('操作成功');
        yield put({
          type: 'queryItems',
        });
      } else {
        message.error('操作失败');
      }
    },
    *deleteItem({ payload: id }, { call, put }) {
      const data = yield call(() => {
        return request(`/api/users/${id}`, {
          method: 'delete',
        })
          .then(() => true)
          .catch(() => false);
      });
      if (data) {
        message.success('操作成功');
        yield put({
          type: 'queryItems',
        });
      } else {
        message.error('操作失败');
      }
    },
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload || [];
    },
    setTotal(state, action) {
      state.total = action.payload || 0;
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

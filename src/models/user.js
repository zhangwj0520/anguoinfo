import {
  reigsterAccount,
  queryAllUsers,
  userUpdate,
  userDelete
} from "../services/api";
import { Feedback } from "@icedesign/base";
import { routerRedux } from "dva/router";

export default {
  namespace: "user",
  state: {
    allUsersData: {}
  },

  effects: {
    *register({ payload }, { call, put }) {
      const response = yield call(reigsterAccount, payload);
      if (response.status === "ok") {
        Feedback.toast.success("注册成功!");
        yield put(routerRedux.replace("/login"));
      } else {
        Feedback.toast.error("用户名已经存在!");
      }
    },
    *fetchAllUsers({}, { call, put }) {
      const response = yield call(queryAllUsers);
      yield put({
        type: "saveAllUsers",
        payload: response
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(userUpdate, payload);
      Feedback.toast.success("更新成功!!!");
      yield put({
        type: "saveAllUsers",
        payload: response
      });
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(userDelete, payload);
      Feedback.toast.success("删除成功!!!");
      yield put({
        type: "saveAllUsers",
        payload: response
      });
    }
  },

  reducers: {
    saveAllUsers(state, { payload }) {
      return {
        ...state,
        allUsersData: payload
      };
    }
  }
};

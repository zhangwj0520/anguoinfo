import { reigsterAccount } from "../services/api";
import { Feedback } from "@icedesign/base";
import { routerRedux } from "dva/router";

export default {
  namespace: "user",
  state: {
    currentUser: {}
  },

  effects: {
    *register({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(reigsterAccount, payload);
      console.log(response);
      if (response.status === "ok") {
        Feedback.toast.success("注册成功!");
        yield put(routerRedux.replace("/login"));
      } else {
        Feedback.toast.error("用户名已经存在!");
      }
    }

    // *fetchCurrent({ payload }, { call, put }) {
    //   const response = yield call(queryCurrent, payload);
    //   yield put({
    //     type: "saveCurrentUser",
    //     payload: response
    //   });
    // }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload[0]
      };
    }
  }
};

import { Feedback } from "@icedesign/base";
import { routerRedux } from "dva/router";
import { signIn, signOut } from "../services/api";
import { setAuthority } from "../utils/authority";

export default {
  namespace: "login",

  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(signIn, payload);
      yield put({
        type: "changeLoginStatus",
        payload: response
      });
      // Login successfully
      if (response.status === "ok") {
        Feedback.toast.success("登录成功!");
        // reloadAuthorized(); 权限
        yield put(routerRedux.replace("/"));
      }
      if (response.status === "noauth") {
        Feedback.toast.error("无权登录,请先申请权限");
      }
      if (response.status == "error") {
        Feedback.toast.error("密码错误");
      }
      if (response.status == "no-user") {
        Feedback.toast.error("无此用户");
      }
    }

    // *logout(_, { put }) {
    //   yield put({
    //     type: "changeLoginStatus",
    //     payload: {
    //       status: false,
    //       currentAuthority: "guest"
    //     }
    //   });
    //   reloadAuthorized();
    //   yield put(
    //     routerRedux.push({
    //       pathname: "/user/login",
    //       search: stringify({
    //         redirect: window.location.href
    //       })
    //     })
    //   );
    // }
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload);
      return {
        ...state,
        status: payload.status
      };
    }

    // changeSubmitting(state, { payload }) {
    //   return {
    //     ...state,
    //     status: payload,
    //     submitting: payload
    //   };
    // }
  }
};

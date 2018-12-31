import { routerRedux } from "dva/router";
import { signIn, signOut } from "../services/api";

export default {
  namespace: "login",

  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(signIn, payload);
      //   yield put({
      //     type: "changeLoginStatus",
      //     payload: response
      //   });
      console.log(response);
      // Login successfully
      if (response.status === "ok") {
        message.success("登录成功");
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        yield put(routerRedux.replace(redirect || "/"));
      }
      if (response.status === "noauth") {
        message.error("无权登录,请先申请权限", 10);
      }
      if (response.status == "0") {
        message.error("密码错误", 10);
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: "changeLoginStatus",
        payload: {
          status: false,
          currentAuthority: "guest"
        }
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: "/user/login",
          search: stringify({
            redirect: window.location.href
          })
        })
      );
    }
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload);
      return {
        ...state,
        status: payload.status,
        type: payload.type
      };
    },

    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.length > 0 ? "ok" : "error",
        type: payload.type,
        info: payload
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        status: payload,
        submitting: payload
      };
    }
  }
};

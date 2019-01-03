import { routerRedux } from "dva/router";
import { Feedback } from "@icedesign/base";
const { toast } = Feedback;
import { uploadFile } from "../services/api";

export default {
  namespace: "file",
  state: {
    status: undefined
  },

  effects: {
    *upload({ payload }, { call, put }) {
      const response = yield call(uploadFile, payload);
      if (response.status === "ok") {
        toast.success("提交成功");
      } else if (response.status === "existence") {
        toast.error("订单已经存在,请勿重复提交");
      }
    }
  },

  reducers: {}
};

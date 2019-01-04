import {
  queryAllList,
  removeList,
  queryOneList,
  updateOneList,
  removeFakeList,
  addFakeList,
  updateFakeList,
  updateListTime,
  queryMedNameList,
  querySpendList,
  updateSpend,
  exportFileList,
  fakeMedChartData
} from "../services/api";
import XLSX from "xlsx";
import { Feedback } from "@icedesign/base";
const { toast } = Feedback;
export default {
  namespace: "bund",
  state: {
    data: {
      list: [],
      pagination: {}
    },
    oneListData: [],
    oneListDataLen: 0,
    spendList: [],
    spendListLen: 0,
    MedNameList: []
  },

  effects: {
    //获取所有订单
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAllList, payload);
      yield put({
        type: "queryList",
        payload: response
      });
    },
    //查询单个
    *fetchOne({ payload }, { call, put }) {
      const response = yield call(queryOneList, payload);
      console.log(response);
      yield put({
        type: "queryOne",
        payload: response
      });
    },
    //更新
    *updateOne({ payload }, { call, put }) {
      const response = yield call(updateOneList, payload);
      toast.success("数据更新成功");
      yield put({
        type: "queryOne",
        payload: response
      });
    },
    *deleteList({ payload }, { call, put }) {
      const response = yield call(removeList, payload);
      toast.success("订单删除成功");
      yield put({
        type: "queryList",
        payload: response
      });
    },
    //更新订单时间
    *updateTime({ payload }, { call, put }) {
      const response = yield call(updateListTime, payload);
      toast.success("订单时间更新成功");
      yield put({
        type: "queryList",
        payload: response
      });
    },

    //查询费用明细
    *fetchSpend({ payload }, { call, put }) {
      const response = yield call(querySpendList, payload);
      yield put({
        type: "querySpend",
        payload: response.spendList
      });
    },
    //更新订单其他费用明细
    *updateSpend({ payload }, { call, put }) {
      const response = yield call(updateSpend, payload);
      yield put({
        type: "querySpend",
        payload: response.spendList
      });
    },
    *exportFile({ payload }, { call, put }) {
      const response = yield call(exportFileList, payload);
      yield put({
        type: "exportListData",
        payload: response
      });
    },

    *fetchMedName({}, { call, put }) {
      const response = yield call(queryMedNameList);
      yield put({
        type: "queryMedNameList",
        payload: response
      });
    },
    *fetchOneMed({ payload }, { call, put }) {
      const response = yield call(fakeMedChartData, payload);
      console.log(response);
      //   yield put({
      //     type: "queryMedList",
      //     payload: response
      //   });
    }

    // *appendFetch({ payload }, { call, put }) {
    //   const response = yield call(queryFakeList, payload);
    //   yield put({
    //     type: "appendList",
    //     payload: Array.isArray(response) ? response : []
    //   });
    // },
    // *submit({ payload }, { call, put }) {
    //   let callback;
    //   if (payload.id) {
    //     callback =
    //       Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
    //   } else {
    //     callback = addFakeList;
    //   }
    //   const response = yield call(callback, payload); // post
    //   yield put({
    //     type: "queryList",
    //     payload: response
    //   });
    // }
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        data: { list: payload }
        //spendList:payload.spendList,
      };
    },
    queryMedList(state, { payload }) {
      return {
        ...state,
        MedList: payload
      };
    },

    queryOne(state, { payload }) {
      const { oneListData } = payload;
      return {
        ...state,
        oneListData,
        oneListDataLen: oneListData.length
      };
    },
    querySpend(state, { payload }) {
      return {
        ...state,
        spendList: payload
      };
    },
    setOneList(state, { payload }) {
      return {
        ...state,
        detailList: payload
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload)
      };
    },
    exportListData(state, { payload }) {
      const { exportListData, fileName } = payload;
      const ws = XLSX.utils.aoa_to_sheet(exportListData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
      XLSX.writeFile(wb, `${fileName}-盛大 - 张增欣 - 报价.xlsx`);
      toast.success("订单导出成功");
    },
    queryMedNameList(state, { payload }) {
      return {
        ...state,
        MedNameList: payload
      };
    }
  }
};

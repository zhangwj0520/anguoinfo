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
  updateSpend
} from "../services/api";

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
    MedList: []
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
      console.log(response);
      yield put({
        type: "queryOne",
        payload: response
      });
    },

    *deleteList({ payload }, { call, put }) {
      const response = yield call(removeList, payload);
      yield put({
        type: "queryList",
        payload: response
      });
    },

    //更新订单时间
    *updateTime({ payload }, { call, put }) {
      const response = yield call(updateListTime, payload);
      yield put({
        type: "queryList",
        payload: response
      });
    },
    //更新订单其他费用明细
    *updateSpend({ payload }, { call, put }) {
      const response = yield call(updateSpend, payload);
      console.log(response);
      yield put({
        type: "querySpend",
        payload: response
      });
    },

    //获取要品名称
    *fetchMedName({}, { call, put }) {
      const response = yield call(queryMedNameList);
      yield put({
        type: "queryMedList",
        payload: response
      });
    },

    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: "appendList",
        payload: Array.isArray(response) ? response : []
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback =
          Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: "queryList",
        payload: response
      });
    }
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
        oneListDataLen: oneListData.length,
        spendList: payload.spendList //feiyong
      };
    },
    querySpend(state, { payload }) {
      return {
        ...state,
        spendList: payload.spendList
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
    }
  }
};

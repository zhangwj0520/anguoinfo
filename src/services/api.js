import Store from "store";
import request from "../utils/request";

// 用户登录
export async function signIn(params) {
  return request("/med/user/login", {
    method: "POST",
    body: params
  });
}
// 用户退出了
export async function signOut() {
  // 清除TOKEN，模拟退出
  Store.clearAll();
  return true;
}

//询价单上传
//上传
export async function uploadFile(params) {
  return request("/med/list/add", {
    method: "POST",
    body: params
  });
}
//获取所有订单信息
export async function queryAllList() {
  return request("/med/list/");
}
//获取某个订单
export async function queryOneList(params) {
  return request(`/med/list/${params}`);
}

//更新某个订单
export async function updateOneList(params) {
  //console.log(params)
  const { id, data } = params;
  return request(`/med/list/edit/${id}`, {
    method: "POST",
    body: { data }
  });
}
//删除订单
export async function removeList(params) {
  return request("/med/list/delete", {
    method: "POST",
    body: params
  });
}

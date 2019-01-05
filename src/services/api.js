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
//用户注册
export async function reigsterAccount(params) {
  return request("/med/user/register", {
    method: "POST",
    body: params
  });
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
//更新某个报价
export async function updateOnePrice(params) {
  //console.log(params)
  const { id, data } = params;
  return request(`/med/list/updateprice`, {
    method: "POST",
    body: { data, id }
  });
}
//删除单个品种
export async function deleteOneMed(params) {
  //console.log(params)
  const { id, name } = params;
  return request(`/med/list/deleteOneMed`, {
    method: "POST",
    body: { name, id }
  });
}
//删除订单
export async function removeList(params) {
  return request("/med/list/delete", {
    method: "POST",
    body: params
  });
}

//更新时间
export async function updateListTime(params) {
  const { id, fahuo_time } = params;
  return request(`/med/list/time/${id}`, {
    method: "POST",
    body: { fahuo_time }
  });
}

//获取某个订单
export async function querySpendList(params) {
  return request(`/med/list/spend/${params}`);
}

//更新订单花费
export async function updateSpend(params) {
  const { id, spendList } = params;
  return request(`/med/list/spend/${id}`, {
    method: "POST",
    body: { spendList }
  });
}

//exportFileList
export async function exportFileList(params) {
  return request(`/med/list/export/${params}`);
}

//medmane
export async function queryMedNameList() {
  return request("/med/list/namelist", {
    method: "POST"
  });
}
//获取med for name
export async function fakeMedChartData(params) {
  //console.log(params)
  return request("/med/list/find", {
    method: "POST",
    body: params
  });
}

//获取所有用户
export async function queryAllUsers() {
  return request("/med/user/current");
}

//更新用户设置
export async function userUpdate(params) {
  return request("/med/user/update", {
    method: "POST",
    body: params
  });
}
//更新用户设置
export async function userDelete(params) {
  return request("/med/user/delete", {
    method: "POST",
    body: params
  });
}

import fetch from "dva/fetch";
import Notification from "@icedesign/notification";

//import Config from '../common/config';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  Notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText
  });
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  let urls = "http://123.56.15.36:8989" + url;
  //let urls = "http://127.0.0.1:8989" + url;
  const defaultOptions = {
    mode: "cors"
    //cache: 'force-cache', //表示fetch请求不顾一切的依赖缓存, 即使缓存过期了, 它依然从缓存中读取. 除非没有任何缓存, 那么它将发送一个正常的request.
    // credentials: 'include', Fetch 请求默认是不带 cookie 的，需要设置 fetch(url, {credentials: 'include'})
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === "POST" || newOptions.method === "PUT") {
    newOptions.headers = {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      ...newOptions.headers
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return (
    //fetch(url, options)
    fetch(urls, newOptions)
      .then(checkStatus)
      .then(response => response.json())
      .catch(error => {
        if (error.code) {
          Notification.error({
            message: error.name,
            description: error.message
          });
        }
        if ("stack" in error && "message" in error) {
          Notification.error({
            message: `请求错误: ${url}`,
            description: error.message
          });
        }
        return error;
      })
  );
}

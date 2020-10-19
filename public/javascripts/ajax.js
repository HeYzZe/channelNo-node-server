const http = (config, successcb, errorcb) => {
  var xmlHttp = null;
  // 创建XMLHttpRequest对象，老版本的IE（IE5，IE6）使用ActiveX对象
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest;
  } else {
    xmlHttp = ActiveXObject("Microsoft.XMLHTTP");
  }
  // 判断是否支持请求
  if (xmlHttp === null) {
    console.log('浏览器不支持XMLHttp');
    return;
  }
  // 请求方式  转换为大写
  var httpMethod = (config.method || 'Get').toUpperCase();
  // 数据类型
  var httpDataType = config.dataType || 'json';
  // url
  var httpUrl = config.url || '';
  // 异步请求
  var async = true;
  // post 请求时参数处理
  if (httpMethod === 'GET') {
    // 请求体中的参数
    var data = config.data || {};
    var requestData = '';
    for (var key in data) {
      if (data[key]) {
        requestData = requestData + key + '=' + data[key] + '&';
      }
    }
    if (requestData == '') {
      requestData = '';
    } else {
      requestData = requestData.substring(0, requestData.length - 1);
    }
  } else if (httpMethod === 'POST') {
    // 请求体中的参数
    var data = config.data || {};
    var requestData = '';
    for (var key in data) {
      requestData = requestData + key + '=' + data[key] + '&';
    }
    if (requestData == '') {
      requestData = '';
    } else {
      requestData = requestData.substring(0, requestData.length - 1);
    }
  }
  // onreadystatechange 是一个事件句柄。它的值是一个函数的名称，当 XMLHttpRequest 对象的状态发生改变时，会触发此函数。状态从 0 (uninitialized) 到 4 (complete) 进行变化。仅在状态为 4 时，我们才执行代码
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status == 200) {
        // 请求成功执行的回调函数
        successcb(xmlHttp.responseText);
      } else {
        successcb([]);
      }
    } else {
      // 请求失败的回调
      errorcb(xmlHttp.status);
    }
  }
  // 请求接口
  if (httpMethod == 'GET') {
    xmlHttp.open('GET', `${httpUrl}${requestData ? `?${requestData}` : ''}`, async);
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;application/json; charset=utf-8');
    xmlHttp.send(null);
  } else if (httpMethod == 'POST') {
    xmlHttp.open('POST', httpUrl, async);
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;application/json; charset=utf-8');
    xmlHttp.send(requestData);
  }
}

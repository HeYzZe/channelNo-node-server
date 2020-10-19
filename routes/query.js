var express = require('express');
//导入url模块
var url = require('url');
var router = express.Router();
// 引入mysql模块
var mysql = require('mysql');
// 引入解密模块
var crypto = require('crypto');
// 引入文件
var dbConfig = require('../database/DBConfig');
var querysql = require('../database/querysql');
// 使用DBConfig中配置创建MySQL连接
var pool = mysql.createPool(dbConfig.mysql);

// 响应JSON数据
var responseJSON = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.json({ code: '-200', msg: '操作失败' });
  } else {
    res.json({ code: '200', msg: '操作成功', data: ret });
  }
}

/**
 * 128位 
 * return base64
 */
const encryption = (data) => {
  let key = querysql.key;
  let iv = querysql.iv || '';
  var cipherChunks = [];
  var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
  cipher.setAutoPadding(true);
  cipherChunks.push(cipher.update(data, querysql.clearEncoding, querysql.cipherEncoding));
  cipherChunks.push(cipher.final(querysql.cipherEncoding));
  return cipherChunks.join('');
}

/**
 * aes解密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
const getChannelNo = (data, key = querysql.key, iv = querysql.iv) => {
  if (!data) {
      return "";
  }
  iv = iv || "";
  var cipherChunks = [];
  try {
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
    cipherChunks.push(decipher.update(data, querysql.cipherEncoding, querysql.clearEncoding));
    cipherChunks.push(decipher.final(querysql.clearEncoding));
  } catch (error) {
    console.log(error, '输入编码格式错误无法解码');
  }
  return cipherChunks.join('');
}

// 进行查询
router.get('/', (req, res, next) => {
  const params = url.parse(req.url, true).query;
  let requestData = 'where'
  for (var key in params) {
    if (params[key]) {
      if (key === 'channel_no') {
        console.log('查询渠道号解密为：', getChannelNo(params[key]));
        requestData = `${requestData} ${key} = ${getChannelNo(params[key])} and`
      } else if (key === 'stat_date') {
        requestData = `${requestData} date(${key}) between '1970-01-01' and '${params[key]}' and`
      } else {
        requestData = `${requestData} ${key} <= ${params[key]} and`
      }
    }
  }
  if (requestData == 'where') {
    requestData = '';
  } else {
    requestData = requestData.substring(0, requestData.length - 4);
  }
  pool.getConnection((err, connection) => {
    // console.log(`${querysql.query}${requestData ? ' ' + requestData : requestData};`);
    connection.query(`${querysql.query}${requestData ? ' ' + requestData : requestData};`, (err, result) => {
      if (getChannelNo(params.channel_no)) {
        // 将结果以JSON形式返回前台
        responseJSON(res, result);
      } else {
        responseJSON(res, []);
      }
      // 释放链接
      connection.release();
    })
  })
})

module.exports = router;

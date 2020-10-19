var UserSQL = {
  query: 'SELECT * FROM test.t_channel_stat',
  key: '1234567890abcdef', // 解密 密钥
  clearEncoding: 'utf8', // 解码后编码格式
  cipherEncoding: 'hex', // 解码前编码格式
  // iv: '0987654321fedcba'
}

module.exports = UserSQL;

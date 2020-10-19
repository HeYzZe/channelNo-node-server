// 声明文件操作系统对象 
var fs = require('fs');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.readFile('./views/index.html','utf-8', (err, data) => {
    if(err){
        throw err ;
    }
    res.end(data);
  });
});

module.exports = router;

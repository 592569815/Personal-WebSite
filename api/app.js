var express = require("express");

//引入index汇总
var router = require("./router/index.js");
var app = router.register(express);
app.listen(8888, function() {
    console.log('服务开启成功！端口号：8888')
});


//新引入的模块；
var url = require("url");
var sql = require('../mysql/account');

exports.register = function (app){
	//用户登录
	app.post("/account/login", function(request, response){
		console.log('request', request.body)
		//请求数据库
		sql.login(request.body, function(data) {
			//返回数据到页面；
			response.send(data);
		})
	});

	// 获取用户权限信息
	app.get("/user/info", function(request, response) {
		sql.permission(request.body, function(data) {
			//返回数据到页面；
			response.send(data);
		})
	})

	//用户添加
	app.post("/addUser", function(request,response){

		//请求数据库；
		sql.addUser(request.body, function(data){
			//返回数据到页面；
			response.send(data);
		})
	});

	//查询所有用户；
	app.post("/allUser", function(request,response){
		//请求数据库；
		sql.allUser(request.body, function(data){
			//返回数据到页面；
			response.send(data);
		})
	});

	//删除用户；
	app.post("/deleteUser", function(request,response){

		//请求数据库；
		sql.deleteUser(request.body, function(data){
			//返回数据到页面；
			response.send(data);
		})
	});

	//更改用户信息；
	app.post("/updateUser", function(request,response){

		//请求数据库；
		sql.updateUser(request.body, function(data){
			//返回数据到页面；
			response.send(data);
		})
	})
}
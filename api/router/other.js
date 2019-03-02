var bodyParser = require('body-parser');

//新引入的模块；
var url = require("url");
var urlencodedParser = bodyParser.urlencoded({ extended: true })
var sql = require('../mysql/other');

exports.register = function (app) {
	// 获取所有国家
	app.get("/api/getAllCountry", urlencodedParser, function(request, response) {
		//请求数据库
		sql.getCountryData(request.body, function(data) {
			//返回数据到页面；
			response.send(data);
		})
	});

	
}
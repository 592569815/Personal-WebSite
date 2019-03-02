//引入相应模块
const mysql = require('mysql') ;
const crypto = require('crypto') ;

//定义数据库
let sql;
let opts = {
    host:"192.168.1.210",
    user:"sa",
    password:"Idh#168",
    database:"test"
}
let open= function () {
	sql = mysql.createConnection(opts);
	//连接数据库
	sql.connect();
}

module.exports = {
	// 登录 业务
	login:function(data,callback){
		//重新打开数据库；
		open();
		let responseData = {
			code: 0,
			message: '请输入用户或密码！',
			data: {}
		}
		if (!data.password || !data.username) {
			callback(responseData)
			sql.end();
			return 
		}
        const hash = crypto.createHash('md5');
        hash.update(data.password);
        const password = hash.digest('hex')

		//用户名和密码
		let username = data.username;
		
		console.log('password', password)
        
		//查询条件；
		var condition = "select * from user where user = ? and password = ?";

		sql.query(condition,[username, password], function(err, results){
			if (!err) {
				//查询结果；
				if(results.length > 0) {
					responseData.code = 1;
					responseData.message = '登录成功！';
					responseData.data = results[0];
					if (username === 'admin') {
						responseData.data.token = 'admin';
					} else {
						responseData.data.token = 'viewer';
					}
					
					if(callback && typeof callback == "function") {
						callback(responseData);
						
					}
				}else{
					responseData.code = 0;
					responseData.message = '用户名或者密码错误！';
					if(callback && typeof callback == "function") {
						callback(responseData);
					}
				}
				sql.end();
			}
		});

	},
	// 权限 业务
	permission: function(data, callback) {
		console.log('per', data)
		let responseData = {
			code: 0,
			message: '获取失败',
			data: {}
		}
		if (!data.token) {
			callback(responseData);
			return ;
		}
		if (data.token === 'admin') {
			responseData.code = 1;
			responseData.message = '获取成功！';
			responseData.data.token = 'admin';
			responseData.data.roles = ['admin'];
			responseData.data.name = "Super Admin";
			responseData.data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif';
			responseData.data.introduction = '我是超级管理员';
		} else {
			responseData.code = 1;
			responseData.message = '获取成功！';
			responseData.data.token = 'viewer';
			responseData.data.roles = ['viewer'];
			responseData.data.name = "viewer";
			responseData.data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif';
			responseData.data.introduction = '普通用户';
		}
		callback(responseData);


	},
    
	addUser: function(data,callback){
		//重新打开数据库；
		open();

		//用户名;
		var username = data.name;
		var password = data.password;
		var access = data.access;
		var _user = JSON.parse(data._user);

		//查询条件；
		var condition = "select * from user where name = ? ";

		sql.query(condition,[username],function(err,results){
			if(!err){

				//查询结果；
				if(results.length > 0){
					console.log("length")
					if(callback && typeof callback == "function"){

						callback({statu:false,message:"用户已存在！",data:_user});
						sql.end();
					}
				}else{
					var  addSql = 'INSERT INTO user(id, name, password, access) VALUES(0,?,?,?)';
					sql.query(addSql,[username, password, access], function(err,results){
						

						if(callback && typeof callback == "function"){

							callback({statu:true,message:"用户名添加成功！",data:_user});
							sql.end();
						}
					})
				}
			}
		})
	},

	allUser: function(data,callback){
		//重新打开数据库；
		open();
		var pageNo = data.pageNo ? data.pageNo : 1;
		var qty = data.qty ? data.qty : 10;
		console.log(11111111,pageNo,qty);

		//用户数量；
		var total = 0;
		var _condition = "select * from user";
		sql.query(_condition, function(err,results) {
			total = results.length;
		});

		//查询条件；var condition = "select * from user limit " + pageNo*qty + "," + qty;
		var condition = "select * from user limit " + (pageNo - 1)*qty + "," + qty;

		sql.query(condition, function(err,results){
			if(!err){

				//查询结果；
				if(results.length > 0){
					
					console.log("total",total);
					if(callback && typeof callback == "function"){

						callback({statu:true,message:"查询到所有用户！",data:results, total: total, pageNo: pageNo});
						sql.end();
					}
				}else{
					console.log("err");
					callback({statu:false,message:"用户不存在！",data:results});
					sql.end();
				}
			}
		})
	},

	deleteUser: function(data,callback){
		//重新打开数据库；
		open();

		//用户数量；
		var total = 0;
		var _condition = "select * from user";
		sql.query(_condition, function(err,results){
			total = results.length;
		});


		//查询条件；
		var condition = "delete from user where id = ?";
		console.log("222,delete");

		sql.query(condition, [data.id], function(err,results){
			console.log(33,data.id,results)
			if(!err){

				//查询结果；
				if(results.affectedRows > 0){
					var condition = "select * from user limit " + (data.pageNo - 1)*10 + "," + 10;

					sql.query(condition, function(err,results){
					
						console.log("delete,length")
						if(callback && typeof callback == "function"){

							callback({statu: true,message: "用户删除成功！",data: results, total: total, pageNo: data.pageNo});
							sql.end();
						}
					})
				}else{
					console.log("err");
					callback({statu: false,message: "用户删除不成功",data: null});
					sql.end();
				}
			}
		})
	},

	updateUser: function(data,callback){
		//重新打开数据库；
		open();
		var id = data.id;
		var username = data.name;
		var password = data.password;
		var access = data.access;
		var _user = JSON.parse(data._user);

		//查询条件；
		var userSql = 'UPDATE user SET name = ?,password = ?, access = ? WHERE Id = '+ id;
		var userParams = [username, password, access];
		

		sql.query(userSql, userParams, function(err,results){
			console.log(1111111,id, userParams,results)
			if(!err){

				//查询结果；
				if(results.affectedRows > 0){
					console.log("delete,length")
					if(callback && typeof callback == "function"){

						callback({statu:true,message:"用户更新成功！",data:_user});
						sql.end();
					}
				}else{
					console.log("err");
					callback({statu:false,message:"用户更新不成功",data:_user});
					sql.end();
				}
			}
		})
	}

}
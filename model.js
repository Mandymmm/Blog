// 1.引入mongoose
let mongoose = require('mongoose');
// 2.连接数据库
mongoose.connect('mongodb://127.0.0.1/Blog'); //默认端口号27017可以省略
// 3.定义schema
let User = new mongoose.Schema({
    username:String, //用户名
    password:String, //密码
    email:String, //邮箱
    avatar:String //头像
});
// 4.定义model  （3 4可以合并）
// 如果不通过collection给定user，那么集合名称=模型名->小写(user)->复数形式(users)
exports.User = mongoose.model('User',User);






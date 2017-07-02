// 1.引入mongoose
let mongoose = require('mongoose');
mongoose.Promise = Promise;
let ObjectId = mongoose.Schema.Types.ObjectId;
// 2.连接数据库  conn 是连接对象
let conn = mongoose.createConnection('mongodb://127.0.0.1/Blog'); //默认端口号27017可以省略
// 3.定义schema
let User = new mongoose.Schema({
    username:String, //用户名
    password:String, //密码
    email:String, //邮箱
    avatar:String //头像
});
// 4.定义model  （3 4可以合并）
// 如果不通过collection给定user，那么集合名称=模型名->小写(user)->复数形式(users)
exports.User = conn.model('User',User);

exports.Category = conn.model('Category',new mongoose.Schema({
    name: String  // 分类名称  类型是字符串
}));

exports.Article = conn.model('Article',new mongoose.Schema({
    title:String, // 标题
    content:String, // 内容正文
    // 外键  别的集合的主键  ref -- reference 引用(此外键是引用的哪个集合的主键)
    author:{type:ObjectId,ref:'User'},  // 文章作者  类型是对象ID类型
    category:{type:ObjectId,ref:'Category'},
    createAt:{type:Date,default:Date.now}  // 时间  类型是Date  默认是Date.now now不要加小括号，否则就变成一个永远固定的值了
}));




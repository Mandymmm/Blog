// 加载express模块
let express = require('express');
let path =require('path');
let session = require('express-session');
let bodyParser = require('body-parser');
let MongoStore = require('connect-mongo')(session);
let flash = require('connect-flash');// flash 会提供写消息 但是这个消息只能读一次就没有了
let index = require('./routes/index');
let user = require('./routes/user');
let category = require('./routes/category');
let article = require('./routes/article');
// 调用此方法返回app实例  app其实是一个
let app = express();
// 引入body-parser中间件后会往请求对象上增加一个body属性
// urlencoded()  json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// 使用会话中间件
app.use(session({
    resave:true,  // 每次请求结束重新保存session
    saveUninitialized:true,  // 保存未初始化的session
    secret:'huge', // 加密cookie的密钥
    // 指定session数据的存放位置，可能是内存、文件系统、数据库
    store:new MongoStore({url:'mongodb://127.0.0.1/Blog'})
}));
// 所有的中间件都是函数，所以都需要执行一下再放在use里
// 使用此中间件后，请求会多一个flash属性  req.flash()
// req.flash(type,msg) 二个参数写入一条消息
// req.flash(type)  一个参数表示读取一条消息
app.use(flash());


/*
    ?如何控制页面上的菜单显示：
        1.当登录成功之后，会把查询到的当前用户对象保存到会话对象中  req.session
        2.在渲染其他页面时，先把会话对象(req.session)中的user属性取出来赋给res.locals(真正渲染模板的数据对象)..在模板里就可以通过user有没有值来控制菜单的显示
*/
app.use(function (req,res,next) {
   // res.locals  是真正渲染模板的数据对象
   res.locals.user = req.session.user;
   res.locals.success = req.flash('success').toString(); //因为req.flash()可以多次执行写入而且不会被覆盖掉 ==> 存的时候会存成数组 所以要转化为字符串
    res.locals.error = req.flash('error').toString();
   next();
});
app.use(function (req,res,next) {
    res.success = function (msg,url) {
        req.flash('success',msg);
        res.redirect(url);
    };
    res.error = function (err,url) {
        req.flash('error',err);
        res.redirect(url);
    };
    res.back = function (err) {
        res.error(err.toString(),'back');
    }
    next();
});

// 设置模板引擎
app.set('view engine','html');
// 模板的存放路径
app.set('views',path.resolve('views'));
// 设置如果模板是html的话，使用ejs模板引擎的渲染方法来进行渲染
app.engine('html',require('ejs').__express);
// 把项目根目录下的node_modules作为静态文件根目录
app.use(express.static('node_modules'));
app.use(express.static('public'));
// 路由中间件第一个参数是路径的前缀
// index是一个中间件函数，当服务器收到客户端的请求的时候，会判断前缀，如果前缀匹配，会将路由交给此中间件函数来处理
app.use('/',index);
app.use('/user',user);
app.use('/category',category);// 如果访问的路径是以/category开头的
app.use('/article',article);// 如果访问的路径是以/article开头的



app.listen(8080);

let express = require('express');
let {User} = require('../model');
let {checkLogin,checkNotLogin} = require('../authware');
// 如果表单的tpye=multipart/form-data的话，bodyParser只能处理两种类型 form json
// multer这是一个专门用来处理文件上传的中间件
let multer = require('multer');
// dest 用来指定上传的文件存放的目录  此文件路径应该是相对于server.js所在目录的  也就是说相对于启动的入口文件
let upload = multer({dest:'./public'});

// Router是一个方法，调用此方法会返回一个路由中间件的实例
let router = express.Router();
// 当客户端以GET方法访问/user/signup路径的时候会执行此路由函数
router.get('/signup',checkNotLogin, function (req, res) {
    res.render('user/signup', {title: '用户注册'}); //渲染views目录下面的signup模板
});
router.post('/signup',checkNotLogin, upload.single('avatar'),function (req, res) {
    // avatar 是表单中的input=file元素的name属性
    // req.file 指的是上传的文件信息   req.body包含文本字段
    let user = req.body;
    //  /6c2d10df278340d268e78eb643a92ea0
    user.avatar = `/${req.file.filename}`;
    User.findOne({username:user.username},function (err,oldUser) {
       if(err){
           req.flash('error',err);
           res.redirect('back');
       }else {
           if(oldUser){
               req.flash('error','用户名已注册');
               res.redirect('back');
           }else {
               User.create(user,function (err,doc) {
                   if(err){
                       req.flash('error',err);
                       res.redirect('back');
                   }else {
                       if(doc){
                           req.flash('success','恭喜你注册成功');
                       }else {
                           req.flash('error','注册失败，请重新注册');
                       }
                       res.redirect('/user/signin');
                   }
               });
           }
       }
    });
});

router.get('/signin',checkNotLogin, function (req, res) {
    res.render('user/signin', {title: '用户登录'}); //渲染views目录下面的signup模板
});
router.post('/signin',checkNotLogin, function (req, res) {
    let user = req.body;
    User.findOne(user,function (err,doc) {
        if(err){
            req.flash('error',err);
            res.redirect('back');
        }else {
            if(doc){ // 如果doc有值，则表示查到数据了，如果没有值null则表示没有查到
                // 如果登录成功之后，会把对象放到会话中去
                // session是跨请求保存数据
                req.flash('success','恭喜你登录成功'); // 写入
                req.session.user = doc;
                res.redirect('/');
            }else {
                req.flash('error','登录失败'); // 写入
                res.redirect('back');
            }
        }
    });
});
router.get('/signout',checkLogin, function (req, res) {
    req.session.user = null;
    req.flash('success','退出成功');
    res.redirect('/user/signin');
});


// 一定要先行导出此路由中间件  避免忘记
module.exports = router;

/*
console.log(req.file);
==>
 { fieldname: 'avatar',   字段名  input=file的name属性 是avatar
 originalname: 'QQ截图20170629093631.png',  原始的文件名
 encoding: '7bit',
 mimetype: 'image/png',  文件类型
 destination: './public',  目标，目的地
 filename: '6c2d10df278340d268e78eb643a92ea0',  文件名
 path: 'public\\6c2d10df278340d268e78eb643a92ea0',  文件路径
 size: 73812 }

*/
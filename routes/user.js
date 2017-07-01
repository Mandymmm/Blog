let express = require('express');
let {User} = require('../model');
// Router是一个方法，调用此方法会返回一个路由中间件的实例
let router = express.Router();
// 当客户端以GET方法访问/user/signup路径的时候会执行此路由函数
router.get('/signup', function (req, res) {
    res.render('user/signup', {title: '用户注册'}); //渲染views目录下面的signup模板
});
router.post('/signup', function (req, res) {
    let user = req.body;
    User.create(user,function (err,doc) {
        if(err){
            res.redirect('back');
        }else {
            res.redirect('/user/signin');
        }
    });
});
router.get('/signin', function (req, res) {
    res.render('user/signin', {title: '用户登录'}); //渲染views目录下面的signup模板
});
router.post('/signin', function (req, res) {
    let user = req.body;
    User.findOne(user,function (err,doc) {
        if(err){
            res.redirect('back');
        }else {
            if(doc){ // 如果doc有值，则表示查到数据了，如果没有值null则表示没有查到
                // 如果登录成功之后，会把对象放到会话中去
                // session是跨请求保存数据
                req.session.user = doc;
                res.redirect('/');
            }else {
                res.redirect('back');
            }
        }
    });
});
router.get('/signout', function (req, res) {
    req.session.user = null;
    res.redirect('/user/signin');
});


// 一定要先行导出此路由中间件  避免忘记
module.exports = router;
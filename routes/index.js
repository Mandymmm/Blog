let express = require('express');
let {Article} = require('../model');
let router = express.Router();

router.get('/',function (req,res) {
   // populate 一个字段  表示把一个字段从ID转成对象
   // author 外键是一个字符串  populate方法相当于把外键对应的那个集合的主键对应的整个对象拿过来用
   Article.find({}).populate('author').exec(function (err,articles) {
       res.render('index',{title:'首页',articles});
   });
});

module.exports = router;


let express = require('express');
let router = express.Router();

router.get('/list',function (req,res) {
   res.send('分类列表');
});
router.get('/add',function (req,res) {
   res.send('增加分类');
});
router.get('/delete',function (req,res) {
   res.send('删除分类');
});

module.exports = router;

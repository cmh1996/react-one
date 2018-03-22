const router = require('koa-router')();
const dynamic = require('../controllers/dynamic');

//发送动态
router.post('/privateApi/dynamic/post', dynamic.postDynamic);

//获得某个用户的动态页数据
router.get('/api/dynamic/personal', dynamic.getPersonalDynamic);

//获得关注了的人的最新动态
router.get('/privateApi/dynamic/latest', dynamic.getLatestDynamic);

//点赞取消点赞
router.post('/privateApi/dynamic/toggleLike', dynamic.toggleLike);

//获得动态详情
router.get('/api/dynamic/detail', dynamic.getDynamicDetail);

//发送评论
router.post('/privateApi/dynamic/sendComment', dynamic.sendComment);

//删除动态
router.post('/privateApi/dynamic/deleteDynamic', dynamic.deleteDynamic);

module.exports = router;
const router = require('koa-router')();
const user = require('../controllers/user');

//注册
router.post('/api/user/signup', user.signup);

//登录
router.post('/api/user/login', user.login);

//获得用户基本信息
router.get('/api/user/data', user.getData);

//修改昵称
router.post('/privateApi/user/setNickname',user.setNickname);

//修改性别
router.post('/privateApi/user/setSex',user.setSex);

//修改城市
router.post('/privateApi/user/setCity',user.setCity);

//修改头像
router.post('/privateApi/user/setHeadimg',user.setHeadimg);

//修改密码
router.post('/privateApi/user/setPwd',user.setPwd);

//搜索用户
router.get('/api/user/search', user.searchUser);

//获得用户关注的人
router.get('/api/user/follow', user.getFollow);

//获得用户粉丝
router.get('/api/user/fans', user.getFans);

//关注
router.post('/privateApi/user/followUser', user.followUser);

//取消关注
router.post('/privateApi/user/cancelFollowUser', user.cancelFollowUser);

//获得私信列表
router.get('/privateApi/user/letters', user.getLetters);

//获得收到的评论列表，发出的评论
router.get('/privateApi/user/comments', user.getComments);

//获得收到的赞，发出的赞
router.get('/privateApi/user/likes', user.getLikes);

//获得消息记录
router.get('/privateApi/user/chatLog', user.getChatLog);

module.exports = router

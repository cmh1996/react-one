const router = require('koa-router')();
const schedule = require('../controllers/schedule');

//新建日程
router.post('/privateApi/schedule/post', schedule.addSchedule);

//得到日程
router.get('/privateApi/schedule/getList', schedule.getSchedule);

//删除日程
router.post('/privateApi/schedule/delete', schedule.deleteSchedule);

//切换已完成未完成
router.post('/privateApi/schedule/toggleDone', schedule.toggleDone);

//编辑日程
router.post('/privateApi/schedule/edit', schedule.editSchedule);

module.exports = router
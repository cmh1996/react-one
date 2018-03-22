const router = require('koa-router')();
const request = require('request');
const cities = require('../config/city.js');

//天气接口
router.get('/api/weather', async (ctx)=>{
	const city = encodeURIComponent(ctx.query.city);
	const options = {
		method: 'GET',
	  	url: `https://free-api.heweather.com/s6/weather/forecast?location=${city}&key=d4814092c6b84e09b50878ec379b27ed`,
	}
   	const result = await request(options);
   	ctx.body = result;
});

//城市列表接口
router.get('/api/cities', async (ctx)=>{
    ctx.body = cities;
})

//新闻接口
router.get('/api/news', async (ctx)=>{
	let channelId = '';
	const start = ctx.query.start;
	const end = ctx.query.end;
	switch(ctx.query.type){
		case 'hot':
			channelId = 'hot';
			break;
		case 'society':
			channelId = 'c9';
			break;
		case 'entertainment':
			channelId = 'c3';
			break;
		case 'military':
			channelId = 'c7';
			break;
		case 'sports':
			channelId = 'c2';
			break;
		case 'technology':
			channelId = 'c6';
			break;
		case 'economics':
			channelId = 'c5';
			break;
		default:
			channelId = 'hot';
	}
	const url = 'http://www.yidianzixun.com/home/q/news_list_for_channel?channel_id='+channelId+'&cstart='+start+'&cend='+end+'&infinite=true&refresh=1&__from__=wap&appid=web_yidian&_=1506763302390';
   	const res = await request(url);
   	ctx.body = res;
});

module.exports = router;

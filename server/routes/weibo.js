const router = require('koa-router')();
const request = require('request');

//热门微博接口
router.get('/api/weibo/hot', async (ctx)=>{
	const pageno = ctx.query.pageno;
	const options = {
		method: 'GET',
	  	url: 'https://m.weibo.cn/api/container/getIndex',
	  	qs: {
			containerid:102803,
			since_id:pageno,
			extparam:'',
			luicode:10000011,
			lfid:102803,
			featurecode:''
	  	},
	  	headers:{
	  		referer:'https://m.weibo.cn/p/index?containerid=102803',
      		host:'m.weibo.cn'
	  	}
	}
   	const result = await request(options);
   	ctx.body = result;
});


//微博详情评论接口
router.get('/api/weibo/comment', async (ctx)=>{
	const id = ctx.query.id;
	const pageno = ctx.query.pageno;
	const options = {
		method: 'GET',
	  	url: 'https://m.weibo.cn/api/comments/show',
	  	qs: {
			id:id,
			page:pageno
	  	}
	}
   	const result = await request(options);
   	ctx.body = result;
});

//微博详情赞接口
router.get('/api/weibo/like', async (ctx)=>{
	const id = ctx.query.id;
	const pageno = ctx.query.pageno;
	const options = {
		method: 'GET',
	  	url: 'https://m.weibo.cn/api/attitudes/show',
	  	qs: {
			id:id,
			page:pageno
	  	},
	  	headers:{
	  		referer:'https://m.weibo.cn/status/'+id,
      		host:'m.weibo.cn'
	  	}
	}
   	const result = await request(options);
   	ctx.body = result;
});

//微博正文接口
router.get('/api/weibo/text', async (ctx)=>{
	const id = ctx.query.id;
	const options = {
		method: 'GET',
	  	url: 'https://m.weibo.cn/statuses/extend',
	  	qs: {
			id:id
	  	}
	}
   	const result = await request(options);
   	ctx.body = result;
});


//微博热搜摘要接口
router.get('/api/weibo/hotSearchSummary', async (ctx)=>{
	const options = {
		method: 'GET',
	  	url: 'https://m.weibo.cn/container/getIndex?containerid=106003type=1'
	}
   	const result = await request(options);
   	ctx.body = result;
});

//微博热搜榜接口
router.get('/api/weibo/hotSearchRanking', async (ctx)=>{
	const options = {
		method: 'GET',
	  	url: 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%253D25%2526t%253D3%2526disable_hot%253D1%2526filter_type%253Drealtimehot&title=%25E5%25BE%25AE%25E5%258D%259A%25E7%2583%25AD%25E6%2590%259C%25E6%25A6%259C&hidemenu=1&extparam=filter_type%3Drealtimehot%26mi_cid%3D%26pos%3D9%26c_type%3D30%26source%3Dranklist%26flag%3D1%26display_time%3D1509206438&luicode=10000011&lfid=106003type%3D1'
	}
   	const result = await request(options);
   	ctx.body = result;
});

//微博搜索结果接口
router.get('/api/weibo/search/result', async (ctx)=>{
	const word = encodeURIComponent(ctx.query.word);
	const options = {
		method: 'GET',
	  	url: 'https://m.weibo.cn/api/container/getIndex',
	  	qs: {
			type:'all',
			queryVal:word,
			luicode:10000011,
			lfid:'100103type%3D1%26q%3Dsdf',
			containerid:encodeURIComponent('100103type=1&q=')+word
	  	}
	}
   	const result = await request(options);
   	ctx.body = result;
});

module.exports = router
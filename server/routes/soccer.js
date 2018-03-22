const router = require('koa-router')();
const request = require('request');

//足球新闻接口
router.get('/api/soccerNews', async (ctx)=>{
	let channelId = '';
	const page = ctx.query.page;
	switch(ctx.query.type){
		case 'headline':
			channelId = 1;
			break;
		case 'hot':
			channelId = 104;
			break;
		case 'deep':
			channelId = 55;
			break;
		case 'England':
			channelId = 3;
			break;
		case 'Spain':
			channelId = 5;
			break;
		case 'Italy':
			channelId = 4;
			break;
		case 'Germany':
			channelId = 6;
			break;
		case 'China':
			channelId = 56;
			break;
		default:
			channelId = 104;
	}
	const url = `https://www.dongqiudi.com/mobile/tab/${channelId}/archives?page=${page}`;
   	const result = await request(url);
   	ctx.body = result;
});


//足球比赛接口
router.get('/api/soccerMatch', async (ctx)=>{
	let channelId = '';
	const date = ctx.query.date;
	switch(ctx.query.type){
		case 'important':
			channelId = 63;
			break;
		case 'England':
			channelId = 13;
			break;
		case 'Spain':
			channelId = 15;
			break;
		case 'Italy':
			channelId = 14;
			break;
		case 'Germany':
			channelId = 16;
			break;
		case 'China':
			channelId = 23;
			break;
		case 'Europe':
			channelId = 17;
			break;
		case 'France':
			channelId = 22;
			break;
		default:
			channelId = 63;
	}
	const url = `https://www.dongqiudi.com/mobile/match/fetch_new?tab=${channelId}&date=${date}&scroll_times=0&tz=-8`;
   	const result = await request(url);
   	ctx.body = result;
});

const channelMap = new Map([
					['England','8'],
					['Spain','7'],
					['Italy','13'],
					['Germany','9'],
					['China','51'],
					['France','16'],
					['Europe','10'],
					['EuropeSecond','18'],
					['Asia','251'],
					['EnglandSecond','70']
					])
//足球积分榜数据接口
router.get('/api/soccerData/teamRanking', async (ctx)=>{
	const channelId = channelMap.get(ctx.query.type);
	const url = `http://m.dongqiudi.com/data/team_ranking/${channelId}`;
   	const result = await request(url);
   	ctx.body = result;
});


//足球射手榜数据接口
router.get('/api/soccerData/goalRanking', async (ctx)=>{
	const channelId = channelMap.get(ctx.query.type);
	const url = `http://m.dongqiudi.com/data/goal_ranking/${channelId}`;
   	const result = await request(url);
   	ctx.body = result;
});

//足球助攻榜数据接口
router.get('/api/soccerData/assistRanking', async (ctx)=>{
	const channelId = channelMap.get(ctx.query.type);
	const url = `http://m.dongqiudi.com/data/assist_ranking/${channelId}`;
   	const result = await request(url);
   	ctx.body = result;
});

//足球获取当前赛事进度、轮数接口
router.get('/api/soccerData/curRound', async (ctx)=>{
	const channelId = channelMap.get(ctx.query.type);
	const url = `http://m.dongqiudi.com/data/round_list/${channelId}`;
   	const result = await request(url);
   	ctx.body = result;
});

//足球赛程数据接口
router.get('/api/soccerData/schedule', async (ctx)=>{
	let stage = ctx.query.stage;
	let round = ctx.query.round;
	const url = `http://m.dongqiudi.com/data/schedule?round_id=${stage}&gameweek=${round}`;
   	const result = await request(url);
   	ctx.body = result;
});


//足球获取比赛详情赛况接口
router.get('/api/soccerMatchData/situation', async (ctx)=>{
	const url = `https://www.dongqiudi.com/mobile/match/situation/${ctx.query.matchid}`;
   	const result = await request(url);
   	ctx.body = result;
});

//足球获取比赛详情阵容接口
router.get('/api/soccerMatchData/lineup', async (ctx)=>{
	const url = `https://www.dongqiudi.com/mobile/match/lineup/${ctx.query.matchid}`;
   	const result = await request(url);
   	ctx.body = result;
});

//足球获取比赛详情分析接口
router.get('/api/soccerMatchData/analysis', async (ctx)=>{
	const url = `https://www.dongqiudi.com/mobile/match/analysis/${ctx.query.matchid}`;
   	const result = await request(url);
   	ctx.body = result;
});

//足球获取比赛详情集锦接口
router.get('/api/soccerMatchData/highlights', async (ctx)=>{
	const url = `https://www.dongqiudi.com/mobile/match/highlights/${ctx.query.matchid}`;
   	const result = await request(url);
   	ctx.body = result;
});

module.exports = router;
const router = require('koa-router')();
const request = require('request');
const music = require('../controllers/music');

//基本参数配置
let musicBaseOptions = {
	g_tk:'534876682',
	hostUin:0,
	format:'json',
	inCharset:'utf8',
	outCharset:'utf8',
	notice:0,
	platform:'yqq',
	needNewCode:0
}

//判断歌单是否已被用户收藏
router.get('/privateApi/music/judgeSonglist',music.judgeSonglist);

//切换收藏
router.post('/privateApi/music/toggleCollect',music.toggleCollect);

//查看已收藏歌单
router.get('/privateApi/music/collectedSonglist',music.getCollectedSonglist);

//音乐厅首页轮播图，热门歌单接口
router.get('/api/music/recommend', async (ctx)=>{
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
	  	qs: Object.assign({},musicBaseOptions),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐厅首页新专辑接口
router.get('/api/music/newAlbum', async (ctx)=>{
	const rawData = {
	  			"comm":{"ct":24},
				"new_album":{
					"module":"QQMusic.MusichallServer",
					"method":"GetNewAlbum",
					"param":{"type":0,"category":"-1","genre":0,"year":1,"company":-1,"sort":1,"start":0,"end":3}
				}
	  		};
	const data = encodeURIComponent(JSON.stringify(rawData));
	const options = {
		method: 'GET',
	  	url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
	  		data:data
		}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐歌手接口
router.get('/api/music/singer', async (ctx)=>{
	const sex = ctx.query.sex;
	const nationality = ctx.query.nationality;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
	  		channel:'singer',
	  		page:'list',
	  		key:nationality+'_'+sex+'_all',
	  		pagesize:100,
	  		pagenum:1,
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});


//音乐歌手详情歌曲、资料接口
router.get('/api/music/singer/song', async (ctx)=>{
	const id = ctx.query.id;
	const start = ctx.query.start;
	const num = ctx.query.num;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
	  		order:'listen',
			begin:start,
			num:num,
			singermid:id,
			platform:'h5page',
			from:'h5',
			_:1508219675349,
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐歌手详情MV接口
router.get('/api/music/singer/mv', async (ctx)=>{
	const id = ctx.query.id;
	const start = ctx.query.start;
	const num = ctx.query.num;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
	  		format:'json',
	  		cid:205360581,
			singermid:id,
			order:'listen',
			begin:start,
			num:num,
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐歌手详情专辑接口
router.get('/api/music/singer/album', async (ctx)=>{
	const id = ctx.query.id;
	const start = ctx.query.start;
	const num = ctx.query.num;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
	  		singermid:id,
			order:'time',
			begin:start,
			num:num,
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐榜单父页面接口
router.get('/api/music/billboard', async (ctx)=>{
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
	  		_:1508219012790
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐榜单详情接口
router.get('/api/music/billboard/detail', async (ctx)=>{
	const id = ctx.query.id;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
	  		_:1508220597988,
	  		page:'detail',
			type:'top',
			topid:id,
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});


//音乐专辑汇总父页面接口
router.get('/api/music/album', async (ctx)=>{
	const pageNum = ctx.query.pageNum;
	const typeId = ctx.query.typeId;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/v8/fcg-bin/album_library',
	  	qs: Object.assign({},musicBaseOptions,{
				cmd:'firstpage',
				page:pageNum,
				pagesize:20,
				sort:2,
				genre:typeId,
				language:-1,
				year:1,
				pay:0,
				type:-1,
				company:-1
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});


//音乐专辑详情接口
router.get('/api/music/album/detail', async (ctx)=>{
	const albumId = ctx.query.albumId;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
			albummid:albumId,
			_:1508219616653,
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});


//音乐歌单汇总接口
router.get('/api/music/songList', async (ctx)=>{
	const start = ctx.query.start;
	const end = ctx.query.end;
	const id = ctx.query.id;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
			picmid:1,
			sortId:5,
			categoryId:id,
			sin:start,
			ein:end,
			outCharset:'utf-8',
			loginUin:0,
			hostUin:0,
			rnd:Math.random(),
			format:'jsonp',
			jsonpCallback:'getPlaylist'
	  	}),
	  	headers:{
	  		referer:'https://c.y.qq.com/',
      		host:'c.y.qq.com'
	  	}
	}
   	const result = await request(options);
   	ctx.body = result;
});


//音乐歌单详情接口
router.get('/api/music/songList/detail', async (ctx)=>{
	const id = ctx.query.id;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
			type: 1,
			json:1,
			utf8:1,
			outCharset:'utf-8',
			disstid: id,
			format:['jsonp','jsonp'],
			jsonpCallback:'playlistinfoCallback'
	  	}),
	  	headers:{
	  		referer:'https://c.y.qq.com/',
      		host:'c.y.qq.com'
	  	}
	}
   	const result = await request(options);
   	ctx.body = result;
});


//mv今日看点接口
router.get('/api/music/mv/news', async (ctx)=>{
	const options = {
		method: 'GET',
	  	url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
			data:'%7B%22getlist%22%3A%7B%22module%22%3A%22MvService.MvInfoProServer%22%2C%22method%22%3A%22GetMvNews%22%2C%22param%22%3A%7B%22index%22%3A0%7D%7D%7D',
			_:1508642127131,
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//mv榜单接口
/*全部all，内地mainland,港台hktw,欧美euus，韩国kr，日本jp*/
router.get('/api/music/mv/ranking', async (ctx)=>{
	const type = ctx.query.type;
	const options = {
		method: 'GET',
	  	url: 'http://c.y.qq.com/mv/fcgi-bin/fcg_musicshow_mvtoplist.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
			listtype:type,
			listid:type+'_musicshow_mvtoplist_current',
			_:1508642737757,
			format:'jsonp',
			jsonpCallback:'MusicJsonCallback'
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//mv分类接口
/*
id是mv类型：0全部、3影视原声，9舞蹈，13演唱会,14颁奖礼，40创意，41搞笑，50剧情，51清新，52民族风，53演奏
type是1最新或2最热，
pageno是页码数
*/
router.get('/api/music/mv/type', async (ctx)=>{
	const id = ctx.query.id;
	const type = ctx.query.type;
	const pageno = ctx.query.pageno;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/v8/fcg-bin/getmv_by_tag',
	  	qs: Object.assign({},musicBaseOptions,{
			utf8:1,
			type:type,
			year:0,
			area:0,
			tag:id,
			pageno:pageno,
			pagecount:20,
			otype:'json',
			taglist:0,
			_:0.545951784939702
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});


//mv详情接口
router.get('/api/music/mv/detail', async (ctx)=>{
	const id = ctx.query.id;
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/mv/fcgi-bin/fcg_get_mvinfo.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
			vid:id,
			smvnum:3,
			recnum:3,
			othernum:3,
			cid:205361939,
			_:1508225366654
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐搜索热词接口
router.get('/api/music/search/hot', async (ctx)=>{
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
			_:1508220848370
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});


//音乐搜索单曲接口
router.get('/api/music/search/song', async (ctx)=>{
	const pageno = ctx.query.pageno;
	const word = encodeURIComponent(ctx.query.word);
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
	  	qs: Object.assign({},musicBaseOptions,{
			ct:24,
			qqmusic_ver:1298,
			new_json:1,
			remoteplace:'txt.yqq.center',
			t:0,
			aggr:1,
			cr:1,
			catZhida:1,
			lossless:0,
			flag_qc:0,
			p:pageno,
			n:20,
			w:word
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐搜索歌单接口
router.get('/api/music/search/songlist', async (ctx)=>{
	const pageno = ctx.query.pageno;
	const word = decodeURIComponent(ctx.query.word);
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist',
	  	qs: Object.assign({},musicBaseOptions,{
			remoteplace:'txt.yqq.playlist',
			flag_qc:0,
			page_no:pageno,
			num_per_page:21,
			query:word,
			format:'jsonp',
			outCharset:'utf-8',
			searchid:116039605337609724
	  	}),
	  	headers:{
	  		referer:'https://c.y.qq.com/',
      		host:'c.y.qq.com'
	  	}
	}
   	const result = await request(options);
   	ctx.body = result;
});


//音乐搜索专辑接口
router.get('/api/music/search/album', async (ctx)=>{
	const pageno = ctx.query.pageno;
	const word = encodeURIComponent(ctx.query.word);
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
	  	qs: Object.assign({},musicBaseOptions,{
			ct:24,
			qqmusic_ver:1298,
			remoteplace:'txt.yqq.album',
			aggr:0,
			catZhida:1,
			lossless:0,
			sem:10,
			t:8,
			p:pageno,
			n:30,
			w:word
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐搜索MV接口
router.get('/api/music/search/mv', async (ctx)=>{
	const pageno = ctx.query.pageno;
	const word = encodeURIComponent(ctx.query.word);
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
	  	qs: Object.assign({},musicBaseOptions,{
			ct:24,
			qqmusic_ver:1298,
			remoteplace:'txt.yqq.mv',
			aggr:0,
			catZhida:1,
			lossless:0,
			sem:1,
			t:12,
			p:pageno,
			n:28,
			w:word
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//音乐搜索提供关键词
router.get('/api/music/search/matchWords', async (ctx)=>{
	const options = {
		method: 'GET',
	  	url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
	  	qs: Object.assign({},musicBaseOptions,{
			is_xml:0,
			key:ctx.query.word
	  	}),
	}
   	const result = await request(options);
   	ctx.body = result;
});

//歌词接口
router.get('/api/music/lyric',async (ctx)=>{
	const options = { 
		method: 'GET',
	    url: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
	    qs: {
		  pcachetime:'1508230212306',
		  songmid:ctx.query.id,
		  jsonpCallback:'MusicJsonCallback_lrc',
		  format:'jsonp',
		},
	    headers: {referer: 'https://y.qq.com/'}
	};
	let result = await request(options);
   	ctx.body = result;
})

module.exports = router;
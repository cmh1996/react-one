const SonglistModel = require('../models/SonglistModel.js');

//判断歌单是否已收藏
exports.judgeSonglist = async (ctx)=>{
	const userId = ctx.query.userId;
	const songlistId = ctx.query.songlistId;
	try{
		const res = await SonglistModel.findOne({
			where:{
				user_id:userId,
				songlist_id:songlistId
			}
		});
		if(!res){
			ctx.body = {
				code:0,
				data:false
			}
		}else{
			ctx.body = {
				code:0,
				data:true
			}
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
	}
}

//切换收藏
exports.toggleCollect = async (ctx)=>{
	const data = ctx.request.body;
	try{
		const res = await SonglistModel.findOne({
			where:{
				user_id:data.userId,
				songlist_id:data.songlistId
			}
		});
		//不存在，就添加收藏
		if(!res){
			const addCollect = await SonglistModel.create({
				user_id:data.userId,
				songlist_id:data.songlistId,
				songlist_img:data.songlistImg,
				songlist_name:data.songlistName,
				songlist_author:data.songlistAuthor,
				createtime:new Date()
			})
			ctx.body = {
				code:0
			}
		}
		//存在，就移除收藏
		else{
			const removeCollect = await SonglistModel.destroy({
		        where:{
		          	user_id:data.userId,
					songlist_id:data.songlistId,
		        }
	      	});
			ctx.body = {
				code:0
			}
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
	}
}

//查看已收藏歌单
exports.getCollectedSonglist = async (ctx)=>{
	const userId = ctx.query.userId;
	try{
		const res = await SonglistModel.findAll({
			where:{
				user_id:userId,
			},
	        order: [
	          ['createtime','DESC']
	        ],
		});
		ctx.body = {
			code:0,
			data:res
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
	}
}

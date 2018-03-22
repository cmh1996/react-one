const ScheduleModel = require('../models/ScheduleModel.js');
const moment = require('moment');

function getDate(str) {
	str = str.replace(/-/g,"/");
	const date = new Date(str);
	return date;
} 

//新建日程
exports.addSchedule = async (ctx)=>{
	let data = ctx.request.body;
	const formatTime = getDate(data.time);
    let newSchedule = {
    	user_id:data.user,
    	title:data.title,
    	remark:data.remark,
    	status:0,
    	matter_time:formatTime,
    	updatetime:new Date(),
    	createtime:new Date()
    };
	try{
		const res = await ScheduleModel.create(newSchedule);
		ctx.body = {
			code:0,
			data:{
				id:res.dataValues.id,
				title:res.dataValues.title,
				remark:res.dataValues.remark,
				status:res.dataValues.status,
				matter_time:moment(res.dataValues.matter_time).format('YYYY-MM-DD HH:mm:ss')
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

//获得日程
exports.getSchedule = async (ctx)=>{
	const userId = ctx.query.id;
	try{
		let schedules = await ScheduleModel.findAll({
	        attributes:['id','title','remark','status','matter_time'],
	        order: [
	        	['status','ASC'],
	          	['matter_time','DESC']
	        ],
	        where: {
	          user_id:userId
	        }
      	});

		for(let schedule of schedules){
			schedule.dataValues.matter_time = moment(schedule.dataValues.matter_time).format('YYYY-MM-DD HH:mm:ss');
		}

		ctx.body = {
			code:0,
			data:schedules
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
	}
}

//删除日程
exports.deleteSchedule = async (ctx)=>{
	const id = ctx.request.body.id;
	try{
		const res = await ScheduleModel.destroy({
	        where:{
	          id:id
	        }
      	});
		ctx.body = {
			code:0
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
	}
}

//切换完成与未完成
exports.toggleDone = async (ctx)=>{
	const id = ctx.request.body.id;
	try{
		const curStatus = await ScheduleModel.findOne({
			attributes:['status'],
			where:{
				id:id
			}
		});

		const res = await ScheduleModel.update(
	      {
	        status:curStatus.dataValues.status===0?1:0
	      },
	      {
	        where: {
	          id:id
	        }
	      }
	    )
		ctx.body = {
			code:0
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
	}
}

//编辑日程
exports.editSchedule = async (ctx)=>{
	const data = ctx.request.body;
	const formatTime = getDate(data.time);
	try{
		const res = await ScheduleModel.update(
	      {
	      	title:data.title,
	        remark:data.remark,
	        matter_time:formatTime
	      },
	      {
	        where: {
	          id:data.id
	        }
	      }
	    )
		ctx.body = {
			code:0
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络出错'
		}
	}
}
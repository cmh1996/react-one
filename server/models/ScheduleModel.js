const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const ScheduleModel = sequelize.define('schedule',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	user_id:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	title:{
		type:Sequelize.STRING(255),
		allowNull:false
	},
	remark:{
		type:Sequelize.STRING(500),
		allowNull:true
	},
	/*0未完成，1已完成*/
	status:{
		type:Sequelize.ENUM(0,1),
		defaultValue: 0,
		allowNull:false
	},
	matter_time:{
		type:Sequelize.DATE,
		allowNull:false
	},
	updatetime:{
		type:Sequelize.DATE,
		allowNull:false
	},
	createtime:{
		type:Sequelize.DATE,
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = ScheduleModel;
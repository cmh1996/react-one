const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const UserModel = sequelize.define('user',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	email:{
		type:Sequelize.STRING(64),
		unique:true,
		allowNull:false
	},
	pwd:{
		type:Sequelize.STRING(255),
		allowNull:false
	},
	nickname:{
		type:Sequelize.STRING(64),
		unique:true,
		allowNull:false
	},
	/*0保密，1男，2女*/
	sex:{
		type:Sequelize.ENUM(0,1,2),
		defaultValue: 0,
		allowNull:false
	},
	city:{
		type:Sequelize.STRING(64),
		defaultValue: '深圳市',
		allowNull:false
	},
	headimg:{
		type:Sequelize.STRING(500),
		allowNull:false,
		defaultValue: 'http://tvax4.sinaimg.cn/crop.0.0.480.480.180/768c39d5ly8fjje1d0teej20dc0dcq35.jpg',
	},
	/*0普通用户，1管理员*/
	role:{
		type:Sequelize.ENUM(0,1),
		defaultValue: 0,
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

module.exports = UserModel;
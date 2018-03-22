const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const LikeModel = sequelize.define('like',{
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
	dynamic_id:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	createtime:{
		type:Sequelize.DATE,
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = LikeModel;
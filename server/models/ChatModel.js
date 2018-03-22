const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const ChatModel = sequelize.define('chat',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	from_id:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	to_id:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	content:{
		type:Sequelize.STRING(500),
		allowNull:false
	},
	createtime:{
		type:Sequelize.DATE,
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = ChatModel;
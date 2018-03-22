const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const CommentModel = sequelize.define('comment',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	dynamic_id:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	from_id:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	to_id:{
		type:Sequelize.BIGINT,
		allowNull:true
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

module.exports = CommentModel;
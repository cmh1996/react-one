const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const SonglistModel = sequelize.define('songlist',{
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
	songlist_id:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	songlist_img:{
		type:Sequelize.STRING(500),
		allowNull:false
	},
	songlist_name:{
		type:Sequelize.STRING(255),
		allowNull:false
	},
	songlist_author:{
		type:Sequelize.STRING(255),
		allowNull:false
	},
	createtime:{
		type:Sequelize.DATE,
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = SonglistModel;
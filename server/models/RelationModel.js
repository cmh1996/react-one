const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const RelationModel = sequelize.define('relation',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	from_id:{
		type:Sequelize.BIGINT,
		references: {
		     model: 'user',
		     key: 'id',
	   	},
		allowNull:false
	},
	to_id:{
		type:Sequelize.BIGINT,
		references: {
		     model: 'user',
		     key: 'id',
	   	},
		allowNull:false
	},
	createtime:{
		type:Sequelize.DATE,
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = RelationModel;
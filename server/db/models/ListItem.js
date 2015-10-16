//ITEM

var Sequelize = require('sequelize');

module.exports = {

	attributes: {

		itemDescription: {
			type: Sequelize.STRING,
			allowNull: false,
		},

		details: Sequelize.TEXT,

		fetch: Sequelize.BOOLEAN,

		bought: Sequelize.BOOLEAN,

		addingUser: {
			//FK
			allowNull: false,
		},

		fetchingUser: {
			//FK
		},

		buyingUser: {
			//FK
		},

		price: {
			type: Sequelize.DECIMAL,
			// Do we want users to be able to add prices later, but require them for reckoning?
			allowNull: false,
			defaultValue: 0.0,
		},

		timeAdded: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW,
		},

		//name here is terrible
		timeFetched: Sequelize.DATE,

		timeBought: Sequelize.DATE,

		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

	},

	options: {},

};
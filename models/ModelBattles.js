/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
"use strict";

const DataTypes = require("sequelize");
const globals = require("../helpers/globals");

const battles = globals.sequelize.define(
  "battles",
  {
    battle_id: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
    },
    winner: { type: DataTypes.BIGINT(20), allowNull: false, unsigned: true },
    loser: { type: DataTypes.BIGINT(20), allowNull: false, unsigned: true },
  },
  {
    timestamp: true,
    underscored: true,
    freezeTableName: true,
    tableName: "battles",
    indexes: [
      {
        name: "winner",
        method: "BTREE",
        fields: ["winner"],
      },
    ],
  },
);

module.exports = battles;

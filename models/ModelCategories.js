/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
"use strict";

const DataTypes = require("sequelize");
const globals = require("../helpers/globals");

const Categories = globals.sequelize.define(
  "categories",
  {
     category_id: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      primaryKey: true,
      unsigned: true,
      autoIncrement: true,
    },
    name: { 
      type: DataTypes.STRING(255), 
      allowNull: false,
      unique: true,
    },
    slug: { 
      type: DataTypes.STRING(255), 
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamp: true,
    underscored: true,
    freezeTableName: true,
    tableName: "categories",
  },
);

module.exports = Categories;

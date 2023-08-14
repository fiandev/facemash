'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dbConnector = require('./helpers/mysqlConnector');
const responseModifier = require('./middlewares/responseModifier');
let config = require('./config');


const app = express();
const env = app.get('env');

config = config(env);
dbConnector.connect(config.mysql);

const globals = require("./helpers/globals");

globals.sequelize.sync().then( async () => {
  await globals.sequelize.drop();
  console.log("success dropping ALL TABLES");
  
  require('./helpers/bootstrap').initApp(app, express);
}).catch(err => console.error);

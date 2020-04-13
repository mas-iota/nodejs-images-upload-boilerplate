const express = require('express');
const path = require('path');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// essential setup
app.use(express.json({
  limit: '5mb'
}));

app.use(express.urlencoded({
  extended: false,
  limit: '5mb'
}));

app.use(express.static(path.join(__dirname, 'public')));

process.title = 'images-boilerplate';
process.on('SIGINT', () => {
  console.log('stopping the application');
  process.exit(1);
});

module.exports = app;

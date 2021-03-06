var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var app = express();

const userRouter = require('./routes/users/userRouter');
const productRouter = require('./routes/products/productRouter');
const { jwtMiddleware } = require('./routes/util/jwtMiddleware');

var whitelist = [/\.brandon121j\.com$/, 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
  }
//app.use(cors(corsOptions));
// app.options('', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(jwtMiddleware);

app.use('/api/', userRouter);
app.use('/api/', productRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  // res.header("Access-Control-Allow-Origin", origin);
  // res.header("Access-Control-Allow-Credentials", true);

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});
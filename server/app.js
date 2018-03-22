const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const jwt = require('koa-jwt');
const cors = require('koa2-cors');

const index = require('./routes/index');
const user = require('./routes/user');
const dynamic = require('./routes/dynamic');
const schedule = require('./routes/schedule');
const weibo = require('./routes/weibo');
const music = require('./routes/music');
const soccer = require('./routes/soccer');

// error handler
onerror(app);

// middlewares
app.use(cors({
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});


app.use(jwt({
	secret:'chambers'
}).unless({path:[/^\/api/]}));

// routes
app.use(index.routes(), index.allowedMethods());
app.use(user.routes(), user.allowedMethods());
app.use(dynamic.routes(), dynamic.allowedMethods());
app.use(schedule.routes(), schedule.allowedMethods());
app.use(weibo.routes(), weibo.allowedMethods());
app.use(music.routes(), music.allowedMethods());
app.use(soccer.routes(), soccer.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;

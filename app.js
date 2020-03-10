// app.js
const http = require("http");
const Koa = require("koa");
const bodyparser = require("koa-bodyparser");
const bouncer = require("koa-bouncer");

const router = require("./utils/router");
const logger = require("./src/middlewares/logger");
const response = require("./src/middlewares/response");

const app = new Koa();

app
  .use(bodyparser({ enableTypes: ["json", "form", "text"], multipart: true }))
  .use(response)
  .use(bouncer.middleware()) // 参数验证
  .use(logger);

router(app);

module.exports = app;

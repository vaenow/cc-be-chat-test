const fs = require('fs');
const path = require('path');
const healthRouter = require('koa-router')();

healthRouter.get('/:version/ping', ctx => {
  return ctx.success("success ping");
});

module.exports = app => {
  /* eslint-disable */
  const basePath = path.resolve(`${__dirname}/../src`);

  app.use(healthRouter.routes(), healthRouter.allowedMethods());

  const router = require(`${basePath}/router.js`);
  router.prefix(`/:version`);

  app.use(router.routes(), router.allowedMethods());
  /* eslint-enable */
};

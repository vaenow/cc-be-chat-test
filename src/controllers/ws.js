const error = require('../error');

// 开始
const index = async ctx => {
  // 当前版本
  const version = ctx
    .validateQuery('version')
    .toString()
    .val();
  ctx.logger.info('what ', version);
  return ctx.success('hello');
};

const p = async ctx => {
  if (ctx) {
    throw error.NOT_FOUND;
  }
};

module.exports = {
  index,
  p
};

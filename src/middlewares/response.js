
const success = (ctx, data) => {
  ctx.body = {
    code: 0,
    message: 'success'
  };
  ctx.body.data = data;
};

const response = (ctx, err) => {
  ctx.body = {
    code: isNaN(err.code) ? 500 : err.code,
    message: (typeof err.message === 'string') ? err.message : 'interal error'
  };
  ctx.body.data = err;
  // TODO add trace-id
}

/**
 * 简化返回参数，去掉 ctx
 */
module.exports = async (ctx, next) => {
  ctx.success = function (...args) {
    return success(ctx, ...args)
  }
  ctx.error = function (args) {
    // TODO 处理错误
    return response(ctx, args)
  }
  ctx.warn = function(args) {
    // TODO 处理警告
    return response(ctx, args);
  };
  return await next()
}


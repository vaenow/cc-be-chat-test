module.exports = async (ctx, next) => {
  ctx.logger = {
    info: data => {
      console.log(JSON.stringify(data))
    },
    warn: data => {
      console.warn(JSON.stringify(data))
    },
    error: data => {
      console.error(JSON.stringify(data))
    }
  };
  ctx.logger.info({
    type: 'IN',
    method: ctx.request.method,
    url: ctx.request.url,
    traceId: ctx.state.traceId,
    header: ctx.request.header,
    query: ctx.request.query,
    body: ctx.request.body
  });
  const start = process.hrtime();
  await next();
  const end = process.hrtime(start);
  // 接口运行时间 ms
  const t = (end[0] * 1e9 + end[1]) / 1e6;

  // 如果时间大于阈值
  if (t > (process.env.MAX_EXEC_TIME || 1000)) {
    ctx.logger.error({
      t,
      traceId: ctx.state.traceId,
      message: `接口执行时间太长: ${t} ms`
    });
  }
  ctx.logger.info({
    t,
    type: 'OUT',
    status: ctx.response.status,
    message: ctx.response.message,
    traceId: ctx.state.traceId,
    body: ctx.body
  });
};

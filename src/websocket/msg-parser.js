// 解析并处理消息
const { MSG_TYPE } = require("../const");

// 解析消息
const parseMessage = async (connCache, messageStr) => {
  const message = JSON.parse(messageStr);
  // 缓存用户信息
  if (!connCache.uid) {
    connCache.uid = message.sendFromUid;
    connCache.nickname = message.sendFromNickName;
  }

  const { content = "" } = message;
  // Forward slash character “/” prefix chat commands
  // TYPE: POPULAR 热词列表
  if (content.match(/^\/popular/)) {
    message.type = MSG_TYPE.POPULAR;
  }
  // TYPE: STATS 查询用户在线时长
  else if (content.match(/^\/stats/)) {
    message.type = MSG_TYPE.STATS;
  }

  return message;
};

module.exports = { parseMessage };

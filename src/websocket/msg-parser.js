// 解析并处理消息
const { MSG_TYPE } = require("../const");
const UserSevice = require("../services/user-service");

// 解析消息
const parseMessage = async messageStr => {
  let message;
  try {
    message = JSON.parse(messageStr);
  } catch (e) {
    console.log(`ERR: invalid message format.`);
    return;
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
    // message.content = content.replace(/^\/stats/, "").trim();
  }


  return message;
};

module.exports = { parseMessage };

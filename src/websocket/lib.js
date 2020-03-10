const { redis, redisPub } = require("../../utils/redis");
const { CHANNEL, MSG_TYPE } = require("../const.js");
const msgFilter = require("./msg-filter");

// 订阅频道
const psubscribe = (connCache, chatroomId) => {
  // 订阅频道: 全部
  if (!connCache.isSub[CHANNEL.ALL]) {
    let key = CHANNEL.ALL;
    redis.subscribe(key);
    connCache.isSub[CHANNEL.ALL] = key;
  }
  // 订阅频道: 仅聊天室
  if (!connCache.isSub[CHANNEL.CHAT_ROOM]) {
    let key = `${CHANNEL.CHAT_ROOM}-${chatroomId}`;
    redis.subscribe(key);
    connCache.isSub[CHANNEL.CHAT_ROOM] = key;
  }
  // 订阅频道: 个人
  if (!connCache.isSub[CHANNEL.USER]) {
    let key = `${CHANNEL.USER}-${connCache.uid}`;
    redis.subscribe(key);
    connCache.isSub[CHANNEL.USER] = key;
  }
};

// 消息协议
const makeMsg = ({ connCache, content, sendToUid }) => {
  return JSON.stringify({
    content,
    sendToUid,
    sendFromUid: connCache.uid,
    sendFromNickName: connCache.nickname,
  });
};

// 发布消息
const publishMessage = ({ connCache, message: { chatroomId, content, type } }) => {
  content = msgFilter(content);

  // 常规消息
  if (type === MSG_TYPE.NORMAL) {
    redisPub.publish(connCache.isSub[CHANNEL.CHAT_ROOM], makeMsg({ connCache, content }));
  }
  // 登录
  else if (type === MSG_TYPE.SYSTEM) {
    redisPub.publish(connCache.isSub[CHANNEL.ALL], makeMsg({ connCache, content: "user online." }));
  }
};

module.exports = {
  psubscribe,
  makeMsg,
  publishMessage,
};

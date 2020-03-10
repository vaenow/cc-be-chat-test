// ws

const { redis, redisPub } = require("../../utils/redis");
const { CHANNEL, MSG_TYPE } = require("../const.js");

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

// 解析消息
const parseMessage = (connCache, messageStr) => {
  const message = JSON.parse(messageStr);
  // 缓存用户信息
  if (!connCache.uid) {
    connCache.uid = message.sendFromUid;
    connCache.nickname = message.sendFromNickName;
  }
  return message;
};

const makeMsg = ({ connCache, message, sendToUid }) => {
  return JSON.stringify({
    message,
    sendToUid,
    sendFromUid: connCache.uid,
    sendFromNickName: connCache.nickname,
  });
};

const sendMessage = ({ connCache, message: { chatroomId, message, type } }) => {
  console.log("type", type === MSG_TYPE.NORMAL, type === MSG_TYPE.LOGIN, type, message);
  // 常规消息
  if (type === MSG_TYPE.NORMAL) {
    redisPub.publish(connCache.isSub[CHANNEL.CHAT_ROOM], makeMsg({ connCache, message }));
  }
  // 登录
  else if (type === MSG_TYPE.LOGIN) {
    redisPub.publish(connCache.isSub[CHANNEL.ALL], makeMsg({ connCache, message: "user online." }));
  }
};

module.exports = wss => {
  // timeout to expire
  wss.on("connection", ws => {
    let connCache = {
      isSub: {},
      uid: null,
      nickname: null,
    };

    // 消息：websocket
    ws.on("message", async messageStr => {
      const message = parseMessage(connCache, messageStr);
      psubscribe(connCache, message.chatroomId);

      console.log("received: %s", messageStr);
      console.log("connCache: %s", JSON.stringify(connCache));

      // 发布消息
      sendMessage({ connCache, message });
    });

    // 消息：redis
    redis.on("message", (channel, messageStr) => {
      console.log('redis.on("message"', messageStr);

      const { sendFromNickName, message } = parseMessage(connCache, messageStr);
      ws.send(`[${channel}]@${sendFromNickName}: ${message}`);
    });

    // 连接成功
    ws.send(`success connected.`);
  });
};

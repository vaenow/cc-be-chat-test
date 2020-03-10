// ws

const { redis, redisPub } = require("../../utils/redis");
const { CHANNEL } = require("../const.js");

// 订阅频道
const psubscribe = (connCache, chatroomId) => {
  // 订阅频道: 全部
  if (!connCache.isSub[CHANNEL.ALL]) {
    redis.subscribe(CHANNEL.ALL);
    connCache.isSub[CHANNEL.ALL] = true;
  }
  // 订阅频道: 仅聊天室
  if (!connCache.isSub[CHANNEL.CHAT_ROOM]) {
    redis.subscribe(`${CHANNEL.CHAT_ROOM}-${chatroomId}`);
    connCache.isSub[CHANNEL.CHAT_ROOM] = true;
  }
  // 订阅频道: 个人
  if (!connCache.isSub[CHANNEL.USER]) {
    redis.subscribe(`${CHANNEL.USER}-${connCache.uid}`);
    connCache.isSub[CHANNEL.USER] = true;
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

module.exports = wss => {
  // timeout to expire
  wss.on("connection", ws => {
    let connCache = {
      isSub: {},
      uid: null,
      nickname: null,
    };

    ws.on("message", async messageStr => {
      const message = parseMessage(connCache, messageStr);
      psubscribe(connCache, message.chatroomId);

      console.log("received: %s", messageStr);
      console.log("connCache: %s", JSON.stringify(connCache))
      redisPub.publish(CHANNEL.ALL, makeMsg({ connCache, message: "user online." }));
    });

    redis.on("message", (channel, messageStr) => {
      const { sendFromNickName, message } = parseMessage(connCache, messageStr);
      ws.send(`[${channel}]@${sendFromNickName}: ${message}`);
    });

    // 连接成功
    ws.send(`success connected.`);
  });
};

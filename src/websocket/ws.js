// ws

const { redis } = require("../../utils/redis");
const { psubscribe, parseMessage, sendMessage } = require("./lib");

module.exports = wss => {
  // timeout to expire
  wss.on("connection", ws => {
    // init caches
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

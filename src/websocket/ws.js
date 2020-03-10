// ws

const { redis } = require("../../utils/redis");
const { psubscribe, publishMessage } = require("./lib");
const { parseMessage } = require("./msg-parser");
const { saveMessage } = require("./msg-db");

module.exports = wss => {
  // timeout to expire
  wss.on("connection", ws => {
    // 初始化配置
    let connCache = {
      isSub: {},
      uid: null,
      nickname: null,
    };

    // 接收客户端的消息：websocket
    ws.on("message", async messageStr => {
      console.log("received: %s", messageStr);
      const message = await parseMessage(connCache, messageStr);
      // 订阅消息
      psubscribe(connCache, message.chatroomId);
      // 发布消息
      await publishMessage({ connCache, message });
      // 保存消息
      await saveMessage(message)
    });

    // 接收平台的消息，然后发送到客户端
    redis.on("message", async (channel, messageStr) => {
      console.log('redis.on("message"', messageStr);
      // 发送消息
      const { sendFromNickName, content } = await parseMessage(connCache, messageStr);
      ws.send(`[${channel}]@${sendFromNickName}: ${content}`);
    });

    // 连接成功
    ws.send(`success connected.`);
  });
};

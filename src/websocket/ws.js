// ws

const Redis = require("../../utils/redis");
const { psubscribe, publishMessage, clientConnected } = require("./lib");
const { parseMessage } = require("./msg-parser");
const { saveMessage } = require("./msg-db");
const { MSG_TYPE } = require("../const");
const { updateUserLogoutTimestamp } = require("../services/user-service");

module.exports = wss => {
  // timeout to expire
  wss.on("connection", async ws => {
    // 初始化配置
    let username = "";

    // 接收客户端的消息：websocket
    ws.on("message", async messageStr => {
      console.log("received: %s", messageStr);
      const message = await parseMessage(messageStr);
      if (!message) return;
      username = message.username;
      
      // 登录开始订阅消息
      psubscribe(message, ws);
      // 发布消息
      await publishMessage(message);
      // 保存消息
      await saveMessage(message);
    });

    // 用户 ws 连接断开
    ws.on("close", async () => {
      // 更新用户登出时间
      await updateUserLogoutTimestamp(username);
    });

    // // 连接成功
    ws.send(clientConnected());
  });
};

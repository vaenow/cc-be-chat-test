// ws

const { redis } = require("../../utils/redis");
const { psubscribe, publishMessage, clientConnected } = require("./lib");
const { parseMessage } = require("./msg-parser");
const { saveMessage } = require("./msg-db");
const { MSG_TYPE } = require("../const");
const { updateUserLogoutTimestamp } = require("../services/user-service");

module.exports = wss => {
  // timeout to expire
  wss.on("connection", async ws => {
    // // 初始化配置
    // let connCache = {
    //   isSub: {},
    //   uid: null,
    //   nickname: null,
    // };
    let username = ''

    // 接收客户端的消息：websocket
    ws.on("message", async messageStr => {
      console.log("received: %s", messageStr);
      const message = JSON.parse(messageStr);
      username = message.username
      // const message = await parseMessage(messageStr);
      // if (message.type === MSG_TYPE.LOGIN) {
      // }
      // 发布消息
      await publishMessage(message);
      // 保存消息
      await saveMessage(message);
    });

    // 接收平台的消息，然后发送到客户端
    redis.on("message", async (channel, messageStr) => {
      console.log('redis.on("message"', messageStr);
      // 发送消息
      // const { sendFromNickName, content } = await parseMessage(connCache, messageStr);
      // ws.send(`[${channel}]@${sendFromNickName}: ${content}`);
      ws.send(messageStr)
    });

    // 用户 ws 连接断开
    ws.on("close", async () => {
      // 更新用户登出时间
      await updateUserLogoutTimestamp(username);
    });

    // // 连接成功
    // ws.send(await sendAllUserInfoList());
    ws.send(clientConnected());
  });
};

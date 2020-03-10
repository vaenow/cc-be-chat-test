const { redis, redisPub } = require("../../utils/redis");
const { CHANNEL, MSG_TYPE } = require("../const.js");
const msgFilter = require("./msg-filter");
const { findLatestMsgByChatroom } = require("./msg-db");
const UserSevice = require("../services/user-service");
const { parseUserLoginTime } = require("./msg-stats");

// 订阅频道
const psubscribe = (username, chatroom) => {
  // 订阅频道: 全部
  // if (!connCache.isSub[CHANNEL.ALL]) {
  let key = CHANNEL.ALL;
  redis.subscribe(key);
  // connCache.isSub[CHANNEL.ALL] = key;
  // }
  // 订阅频道: 仅聊天室
  // if (!connCache.isSub[CHANNEL.CHAT_ROOM]) {
  key = `${CHANNEL.CHAT_ROOM}-${chatroom}`;
  redis.subscribe(key);
  // connCache.isSub[CHANNEL.CHAT_ROOM] = key;
  // }
  // 订阅频道: 个人
  // if (!connCache.isSub[CHANNEL.USER]) {
  key = `${CHANNEL.USER}-${username}`;
  redis.subscribe(key);
  // connCache.isSub[CHANNEL.USER] = key;
  // }
};

// 消息协议
// const makeMsg = ({ connCache, content, sendToUid }) => {
//   return JSON.stringify({
//     content,
//     sendToUid,
//     sendFromUid: connCache.uid,
//     sendFromNickName: connCache.nickname,
//   });
// };
const createMsg = ({ type, username, content, receiver, ...args }) => {
  return JSON.stringify({
    type,
    username,
    content,
    receiver,
    ...args
  });
};

// 发布消息
const publishMessage = async message => {
  const { chatroom, type, username } = message;

  // 和谐内容
  const content = msgFilter(message.content);

  // 登录
  if (type === MSG_TYPE.LOGIN) {
    // 登录开始订阅消息
    psubscribe(username, message.chatroom);
    
    // 查询用户信息 
    let userinfo = await UserSevice.findUserInfoByUserName(username)
    if(!userinfo) { // 如果没有就暂且根据 username 创建一个
      userinfo = await UserSevice.createUserInfoByUserName(username)
    }

    // 如果是登录聊天室，就获取最新的消息记录
    const latestMsgList = await findLatestMsgByChatroom(chatroom);
    const latestMsgStrList = latestMsgList.reverse().map(v => {
      // return makeMsg({
      //   connCache: {
      //     uid: v.uid,
      //     nickname: v.nickName,
      //   },
      //   content: v.content,
      //   sendToUid: v.sendToUid,
      // });
      return createMsg({
        type: MSG_TYPE.CHAT,
        username: v.username,
        content: v.content,
        receiver: v.receiver,
      });
    });
    console.log('latestMsgStrList', latestMsgStrList.length)
    for (let i = 0; i < latestMsgStrList.length; i++) {
      // redisPub.publish(connCache.isSub[CHANNEL.USER], latestMsgStrList[i]);
      redisPub.publish(`${CHANNEL.USER}-${username}`, latestMsgStrList[i]);
    }

    // 登录通知其他用户
    // redisPub.publish(CHANNEL.ALL, makeMsg({ connCache, content }));
    const msg = createMsg({ type: MSG_TYPE.LOGIN, username, user: userinfo });
    console.log('LOGIN msg', msg)
    redisPub.publish(CHANNEL.ALL, msg);

    // 更新用户登录时间
    await UserSevice.updateUserLoginTimestamp(username);
  }

  // 常规聊天消息
  else if (type === MSG_TYPE.CHAT) {
    // redisPub.publish(`${CHANNEL.CHAT_ROOM}-${chatroomId}`, makeMsg({ connCache, content }));
    const msg = createMsg({ type, username, content });
    redisPub.publish(`${CHANNEL.CHAT_ROOM}-${chatroom}`, msg);
  }

  // 统计在线时长 /stats
  else if (type === MSG_TYPE.STATS) {
    let contentRet = "无此用户";

    console.log("content", content);
    const matched = content.match(/\s.*?$/);
    if (matched) {
      const queryNickName = matched && matched[0].trim();
      contentRet = await parseUserLoginTime(queryNickName);
    }
    // redisPub.publish(connCache.isSub[CHANNEL.USER], makeMsg({ connCache, content: contentRet }));
    const msg = createMsg({ type: MSG_TYPE.CHAT, username, content: contentRet });
    redisPub.publish(`${CHANNEL.USER}-${username}`, msg);
  }
};

// 登录时，发送所有用户
const sendAllUserInfoList = async () => {
  const userInfoList = await UserSevice.getAllUserInfo();
  const list = userInfoList.map(v => ({ nickName: v.nickName, uid: v.uid }));
  return createMsg({ type: MSG_TYPE.LIST, data: list });
};

// 客户端连接成功
const clientConnected = () => {
  return createMsg({ type: MSG_TYPE.CONNECTED });
};

module.exports = {
  psubscribe,
  // makeMsg,
  publishMessage,
  sendAllUserInfoList,
  clientConnected,
};

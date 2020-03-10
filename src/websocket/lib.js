const { redis, redisPub } = require("../../utils/redis");
const { CHANNEL, MSG_TYPE } = require("../const.js");
const msgFilter = require("./msg-filter");
const { findLatestMsgByChatroomId } = require("./msg-db");
const UserSevice = require("../services/user-service");
const { parseUserLoginTime } = require("./msg-stats");

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
const publishMessage = async ({ connCache, message }) => {
  const { chatroomId, type } = message;
  const content = msgFilter(message.content);

  // 常规消息
  if (type === MSG_TYPE.NORMAL) {
    redisPub.publish(connCache.isSub[CHANNEL.CHAT_ROOM], makeMsg({ connCache, content }));
  }

  // 登录
  else if (type === MSG_TYPE.LOGIN) {
    // 如果是登录聊天室，就获取最新的消息记录
    const latestMsgList = await findLatestMsgByChatroomId(chatroomId);
    const latestMsgStrList = latestMsgList.reverse().map(v => {
      return makeMsg({
        connCache: {
          uid: v.uid,
          nickname: v.nickName,
        },
        content: v.content,
        sendToUid: v.sendToUid,
      });
    });
    for (let i = 0; i < latestMsgStrList.length; i++) {
      redisPub.publish(connCache.isSub[CHANNEL.USER], latestMsgStrList[i]);
    }

    // 登录通知其他用户
    redisPub.publish(connCache.isSub[CHANNEL.ALL], makeMsg({ connCache, content }));

    // 更新用户登录时间
    await UserSevice.updateUserLoginTimestamp(connCache.nickname);
  }

  // 统计在线时长 /stats
  else if (type === MSG_TYPE.STATS) {
    const msgFormatStats = await parseUserLoginTime(message.sendFromNickName);
    redisPub.publish(connCache.isSub[CHANNEL.USER], makeMsg({ connCache, content: msgFormatStats }));
  }
};

module.exports = {
  psubscribe,
  makeMsg,
  publishMessage,
};

const ChatMsgModel = require("../models/chat-msg");
const { MSG_TYPE } = require("../const");
const msgFilter = require("./msg-filter");

// 保存消息到 DB
const saveMessage = async message => {
  const ret = await ChatMsgModel.create({
    username: message.username,
    reciever: message.reciever,
    content: msgFilter(message.content),
    type: message.type,
    chatroom: message.chatroom,
  });

  // 如保存失败，TODO
  if (!ret) {
    console.error("ERR save message", JSON.stringify(message));
  }
};

// 查询同一聊天室最新的消息
const findLatestMsgByChatroom = async (chatroom, msgLimit = 50) => {
  const msgList = await ChatMsgModel.find({ chatroom, type: MSG_TYPE.CHAT })
    .sort({ createdAt: -1 })
    .limit(msgLimit);
  return msgList;
};

// 查询最近消息
const findLastMsgList = async () => {
  return await ChatMsgModel.find({ createdAt: { $gte: (process.env.LAST_SECONDS || 5) * 1e3 }, type: MSG_TYPE.CHAT });
};

module.exports = {
  saveMessage,
  findLatestMsgByChatroom,
  findLastMsgList,
};

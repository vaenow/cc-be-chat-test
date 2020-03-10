const ChatMsgModel = require("../models/chat-msg");
const { MSG_TYPE } = require("../const");

// 保存消息到 DB
const saveMessage = async message => {
  const ret = await ChatMsgModel.create({
    sender: message.sendFromUid,
    nickName: message.sendFromNickName,
    reciever: message.sendToUid,
    content: message.content,
    type: message.type,
    chatroomId: message.chatroomId,
  });

  // 如保存失败，TODO
  if (!ret) {
    console.error("ERR save message", JSON.stringify(message));
  }
};

// 查询同一聊天室最新的消息
const findLatestMsgByChatroomId = async (chatroomId, msgLimit = 50) => {
  const msgList = await ChatMsgModel.find({ chatroomId, type: MSG_TYPE.NORMAL })
    .sort({ createdAt: -1 })
    .limit(msgLimit);
  return msgList;
};

module.exports = {
  saveMessage,
  findLatestMsgByChatroomId,
};

const ChatMsgModel = require('../models/chat-msg')

// 保存消息到 DB
const saveMessage = async (message) => {
  const ret = await ChatMsgModel.create({
    sender: message.sendFromUid,
    reciever: message.sendToUid,
    content: message.content,
    type: message.type
  })

  // 保存失败，TODO
  if (!ret) {
    console.error('ERR save message', JSON.stringify(message))
  }
}

module.exports = {
  saveMessage,

}
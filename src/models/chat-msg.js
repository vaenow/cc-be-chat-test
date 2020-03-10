const mongoose = require("mongoose");
const commonField = require("../../utils/common_field");

const Schema = new mongoose.Schema({
  username: String, // 发送方昵称
  receiver: String, // 接收方
  type: String, // 消息类型
  content: String, // 消息内容
  chatroom: String, // 聊天室
});

// 公共字段
Schema.plugin(commonField);

module.exports = mongoose.model("chat_msg", Schema);

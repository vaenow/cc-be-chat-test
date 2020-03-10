const mongoose = require("mongoose");
const commonField = require("../../utils/common_field");

const Schema = new mongoose.Schema({
  sender: String, // 发送方
  receiver: String, // 接收方
  type: Number, // 消息类型
  content: String, // 消息内容
});

// 公共字段
Schema.plugin(commonField);

module.exports = mongoose.model("chat_msg", Schema);

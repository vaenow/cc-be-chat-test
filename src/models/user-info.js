const mongoose = require("mongoose");
const commonField = require("../../utils/common_field");

const Schema = new mongoose.Schema({
  uid: {  // 用户ID
    type: String,
    required: true,
  },
  nickName: String, // 昵称
  password: String, // 密码
  // ...MORE
});

// 公共字段
Schema.plugin(commonField);

module.exports = mongoose.model("user_info", Schema);

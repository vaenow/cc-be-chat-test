const mongoose = require("mongoose");
const commonField = require("../../utils/common_field");

const Schema = new mongoose.Schema({
  // 用户ID
  uid: {
    type: String,
    required: true,
  },
  nickName: String, // 昵称
  password: String, // 密码
  // 登录时间
  loginAt: {
    type: Number,
    default: Date.now,
  },
  logoutAt: Number, // 登出时间
  // ...MORE
});

// 公共字段
Schema.plugin(commonField);

module.exports = mongoose.model("user_info", Schema);

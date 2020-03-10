const UserInfoModel = require("../models/user-info");
const uuid = require("../../utils/uuidv4");

// 可移植为独立的用户服务
module.exports = class UserService {
  constructor() {}

  // DEMO: 根据 nickname 查找用户信息
  static async findUserInfoByUserName(username) {
    let userInfo = await UserInfoModel.findOne({ username });
    return userInfo;
  }

  // DEMO: 暂且使用 nickname 创建用户信息
  static async createUserInfoByUserName(username, password) {
    let userInfo = await UserInfoModel.create({
      uid: uuid(),
      username,
      password,
    });
    console.log(userInfo);
    return userInfo;
  }

  // 更新用户登录时间
  static async updateUserLoginTimestamp(username) {
    const ret = await UserInfoModel.updateOne({ username }, { $set: { loginAt: Date.now() } });
  }

  // 更新用户登出时间
  static async updateUserLogoutTimestamp(username) {
    await UserInfoModel.updateOne({ username }, { $set: { logoutAt: Date.now() } });
  }

  // 列出所有用户
  static async getAllUserInfo() {
    return await UserInfoModel.find({}).limit(20)
  }
};

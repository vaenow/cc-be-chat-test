const UserInfoModel = require("../models/user-info");
const uuid = require("../../utils/uuidv4");

// 可移植为独立的用户服务
module.exports = class UserService {
  constructor() {}

  // DEMO: 根据 nickname 查找用户信息
  static async findUidByNickName(nickName) {
    let userInfo = await UserInfoModel.findOne({ nickName });
    console.log('userInfo', userInfo)
    
    // 没有用户 nickname 就创建一个用户
    if (!userInfo) {
      userInfo = await this.createUserInfoByNickName(nickName);
    }

    return userInfo;
  }

  // DEMO: 暂且使用 nickname 创建用户信息
  static async createUserInfoByNickName(nickName, password) {
    let userInfo = await UserInfoModel.create({
      uid: uuid(),
      nickName,
      password,
    });
    console.log(userInfo);
    return userInfo;
  }
};

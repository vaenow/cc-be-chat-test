// 统计用户在线时长
const moment = require("moment");
const momentDurationFormat = require("moment-duration-format");
const { findUidByNickName } = require("../services/user-service");

// 解析用户登入时间
const parseUserLoginTime = async nickName => {
  const userInfo = await findUidByNickName(nickName);
  let { loginAt = Date.now(), logoutAt = Date.now() } = userInfo;

  // 如果还未刷新登出时间，就取当前时间。
  if (logoutAt - loginAt < 0) logoutAt = Date.now();

  return parseTimeFormat(loginAt, logoutAt);
};

// 格式化
const parseTimeFormat = (startAt, endAt) => {
  const start = moment(startAt);
  const end = moment(endAt);
  const diff = end.diff(start);

  // 格式化时间
  return moment.duration(diff, "ms").format("dd[d] hh[h] mm[m] ss[s]", {
    trim: false,
  });
};

module.exports = { parseUserLoginTime, parseTimeFormat };

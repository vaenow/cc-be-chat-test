const _ = require("lodash");
const { findLastMsgList } = require("./msg-db");

// 查询最近热词
const findHotWords = async () => {
  const msgList = await findLastMsgList();
  let hotWords = [];
  // 拆分为单个词
  msgList.map(({ content = "" }) => content.split && hotWords.push(...content.split(/\s+/g)));
  return _findTheMostRepeatWord(hotWords);
};

// 查询重复次数最多的词
const _findTheMostRepeatWord = hotWords => {
  hotWords = hotWords.filter(v => v);
  hotWords = _.chain(hotWords)
    .groupBy() // 分组取值，频次降序
    .values()
    .sort((a, b) => b.length - a.length)
    .value();
  return hotWords.length ? hotWords[0][0] : "暂无热词";
};

module.exports = { findHotWords, _findTheMostRepeatWord };

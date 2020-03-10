const fs = require("fs");
const path = require("path");

// 应用启动时加载到内存
const PROFANITY_WORLDS = loadProfanityInMem();
function loadProfanityInMem() {
  const filepath = path.join(__dirname, "..", "..", "static", "profanity-words.txt");
  const profanityWorlds = fs
    .readFileSync(filepath, "utf8")
    .split(/\n/g) // 按行拆分
    .map(v => v.trim())
    .filter(v => v)
    .sort((a, b) => b.length - a.length); // 逆序匹配
  return profanityWorlds;
}

// 消息内容过滤，添加*
const msgFilter = (messageContent = "") => {
  for (let i = 0; i < PROFANITY_WORLDS.length; i++) {
    const wordReg = new RegExp("(\\s|^)" + PROFANITY_WORLDS[i]);
    messageContent = messageContent.replace(wordReg, matched => {
      // E.g. “hellboy” -> “****boy”
      // " tittie fucker" -> " ****** ******"
      return matched.replace(/[^\s]/g, "*");
    });
  }
  return messageContent;
};

module.exports = msgFilter;

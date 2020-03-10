const { test } = require("ava");

const { _findTheMostRepeatWord } = require("../src/websocket/msg-popular");

// 测试 method: findTheMostRepeatWord
test.serial("test findTheMostRepeatWord", t => {
  const testList = [
    [['b', 'act', 'b', 'cat', 'act', 'act', 'bull'], 'act'],
    [['c', 'mix,', 'c', 'x', 'c' ], 'c'],
    [['sold', 'bottle', 'vis', 'vis'], 'vis']
  ];

  for (let i = 0; i < testList.length; i++) {
    const [list, result] = testList[i];
    t.is(_findTheMostRepeatWord(list), result);
  }
});

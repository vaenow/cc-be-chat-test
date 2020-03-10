const { test } = require("ava");

const { parseTimeFormat } = require("../src/websocket/msg-stats");

// 测试 method: parseTimeFormat
test.serial("test parseTimeFormat", t => {
  const testList = [
    [[1583840857414, 1583840909479], "00d 00h 00m 52s"],
    [[1583840969946, 1583842368090], '00d 00h 23m 18s'],
    [['2018-05-16 12:00:00', '2018-05-17 13:20:10'], '01d 01h 20m 10s']
  ];

  for (let i = 0; i < testList.length; i++) {
    const [[startAt, endAt], result] = testList[i];
    t.is(parseTimeFormat(startAt, endAt), result);
  }
});

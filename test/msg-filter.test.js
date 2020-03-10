const { test } = require("ava");

const msgFilter = require('../src/websocket/msg-filter')

// 测试 method: msgFilter
test.serial('test msgFilter', t => {
  const testList = [
    ['hellboy', '****boy'],
    [' hellboy', ' ****boy'],
    ['hell boy', '**** boy'],
    [' hell boy', ' **** boy'],
    ['bunny fucker  ', '***** ******  '],
    ['son-of-a-bitch', '**************'],
    ['son-of-a-bitch you', '************** you'],
    ['s hit', '* ***'],
  ]

  for (let i=0; i<testList.length; i++) {
    const [before, after] = testList[i]
    t.is(msgFilter(before), after)
  }
})


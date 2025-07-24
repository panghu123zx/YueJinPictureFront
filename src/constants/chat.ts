export const CHAT_STATUS_ENUM = {
  PRIVATE: 0,
  FROND: 1,
  TEAM: 3
}

export const CHAT_STATUS_MAP = {
  0: '私聊',
  1: '好友',
  2: '群聊'
}

export const CHAT_STATUS_OPTIONS = Object.keys(CHAT_STATUS_MAP).map((key) => {
  return {
    label: CHAT_STATUS_MAP[key],
    value: key
  }
})

export const CHAT_MESSAGE_TYPE_ENUM = {
  SEND: 'SEND',
  JOIN: 'JOIN',
  EXIT: 'EXIT',
  HISTORY: 'HISTORY',
  MOREHISTORY: 'MOREHISTORY',
  ERROR: 'ERROR',
  ONLINEUSER: 'ONLINEUSER'
}

export const CHAT_MESSAGE_TYPE_MAP = {
  SEND: '发送消息',
  JOIN: '加入聊天',
  EXIT: '离开聊天',
  HISTORY: '历史消息',
  ERROR: '错误消息',
  ONLINEUSER: '在线用户'
}

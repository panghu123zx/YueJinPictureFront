// 空间类型枚举
export const LIKE_TYPE_ENUM = {
  LIKE: 0,
  SHARE: 1,
}

// 空间类型文本映射
export const LIKE_TYPE_MAP: Record<number, string> = {
  0: '点赞',
  1: '分享',
}

// 空间类型选项映射
export const SPACE_TYPE_OPTIONS = Object.keys(LIKE_TYPE_MAP).map((key) => {
  const value = Number(key) // 将字符串 key 转换为数字
  return {
    label: LIKE_TYPE_MAP[value],
    value,
  }
})


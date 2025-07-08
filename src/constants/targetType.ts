// 空间类型枚举
export const TARGET_TYPE_ENUM = {
  PICTURE: 0,
  FORUM: 1,
}

// 空间类型文本映射
export const TARGET_TYPE_MAP: Record<number, string> = {
  0: '图片',
  1: '帖子',
}

// 空间类型选项映射
export const SPACE_TYPE_OPTIONS = Object.keys(TARGET_TYPE_MAP).map((key) => {
  const value = Number(key) // 将字符串 key 转换为数字
  return {
    label: TARGET_TYPE_MAP[value],
    value,
  }
})


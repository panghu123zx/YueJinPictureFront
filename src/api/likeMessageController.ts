// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** listLikeMessageVO POST /api/message/list/vo */
export async function listLikeMessageVoUsingPost(
  body: API.LikeMessageQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageLikeMessageVO_>('/api/message/list/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** readMessage POST /api/message/read */
export async function readMessageUsingPost(
  body: API.LikeMessageReadDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/message/read', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** addLikeMessage POST /api/message/send */
export async function addLikeMessageUsingPost(
  body: API.LikeMessageAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/message/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

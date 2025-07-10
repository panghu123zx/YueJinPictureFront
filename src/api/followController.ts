// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addFollow POST /api/follow/add */
export async function addFollowUsingPost(body: API.AddFollowDto, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/follow/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getFollowCount GET /api/follow/get/count */
export async function getFollowCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseFollow_>('/api/follow/get/count', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getFollowMy POST /api/follow/get/follow */
export async function getFollowMyUsingPost(
  body: API.FollowQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageFollowVO_>('/api/follow/get/follow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** isFollow POST /api/follow/isfollow */
export async function isFollowUsingPost(
  body: API.FollowQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/follow/isfollow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

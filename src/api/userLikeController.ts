// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addUserLike POST /api/userlike/addUserLike */
export async function addUserLikeUsingPost(
  body: API.UserLikeAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/userlike/addUserLike', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** addUserShare POST /api/userlike/addUserShare */
export async function addUserShareUsingPost(
  body: API.UserLikeAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/userlike/addUserShare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getLikePost POST /api/userlike/get/likeforum */
export async function getLikePostUsingPost(
  body: API.UserLikeQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageForum_>('/api/userlike/get/likeforum', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getLikePic POST /api/userlike/get/likepic */
export async function getLikePicUsingPost(
  body: API.UserLikeQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePicture_>('/api/userlike/get/likepic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getMyLike POST /api/userlike/getMyLike */
export async function getMyLikeUsingPost(
  body: API.UserLikeAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserLikeVO_>('/api/userlike/getMyLike', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getMyShare POST /api/userlike/getMyShare */
export async function getMyShareUsingPost(
  body: API.UserLikeAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserLikeVO_>('/api/userlike/getMyShare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** unUserLike POST /api/userlike/unUserLike */
export async function unUserLikeUsingPost(
  body: API.UserLikeAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/userlike/unUserLike', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

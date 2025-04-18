// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addUserLike POST /api/userlike/addUserLike */
export async function addUserLikeUsingPost(
  body: API.UserLikeAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/userlike/addUserLike', {
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

/** getLikePic POST /api/userlike/get/likepic */
export async function getLikePicUsingPost(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePagePicture_>('/api/userlike/get/likepic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSharePic POST /api/userlike/get/sharepic */
export async function getSharePicUsingPost(
  body: API.PageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePicture_>('/api/userlike/get/sharepic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getMyLike GET /api/userlike/getMyLike */
export async function getMyLikeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserLikeVO_>('/api/userlike/getMyLike', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getMyShare GET /api/userlike/getMyShare */
export async function getMyShareUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserLikeVO_>('/api/userlike/getMyShare', {
    method: 'GET',
    ...(options || {}),
  })
}

/** unUserLike POST /api/userlike/unUserLike */
export async function unUserLikeUsingPost(
  body: API.UserLikeAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/userlike/unUserLike', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

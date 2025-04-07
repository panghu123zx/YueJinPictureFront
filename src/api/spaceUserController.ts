// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addSpaceUser POST /api/spaceUser/add */
export async function addSpaceUserUsingPost(
  body: API.SpaceUserAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/spaceUser/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteSpaceUser POST /api/spaceUser/delete */
export async function deleteSpaceUserUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/spaceUser/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editSpaceUser POST /api/spaceUser/edit */
export async function editSpaceUserUsingPost(
  body: API.SpaceUserEditDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/spaceUser/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceUser POST /api/spaceUser/get */
export async function getSpaceUserUsingPost(
  body: API.SpaceUserQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceUser_>('/api/spaceUser/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listMySpaceUser GET /api/spaceUser/list/my */
export async function listMySpaceUserUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSpaceUserVO_>('/api/spaceUser/list/my', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getListSpaceUser POST /api/spaceUser/list/spaceuser */
export async function getListSpaceUserUsingPost(
  body: API.SpaceUserQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceUser_>('/api/spaceUser/list/spaceuser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getListSpaceUserByVo POST /api/spaceUser/list/spaceuser/vo */
export async function getListSpaceUserByVoUsingPost(
  body: API.SpaceUserQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceUserVO_>('/api/spaceUser/list/spaceuser/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addSpace POST /api/space/add */
export async function addSpaceUsingPost(body: API.SpaceAddDto, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/space/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteSpace POST /api/space/delete */
export async function deleteSpaceUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/space/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editSpace POST /api/space/edit */
export async function editSpaceUsingPost(body: API.SpaceEditDto, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/space/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceById GET /api/space/get */
export async function getSpaceByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpace_>('/api/space/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** getSpaceLevel GET /api/space/get/level */
export async function getSpaceLevelUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSpaceLevel_>('/api/space/get/level', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getSpaceByIdVo GET /api/space/get/vo */
export async function getSpaceByIdVoUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceByIdVoUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceVO_>('/api/space/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** getListSpace POST /api/space/list/space */
export async function getListSpaceUsingPost(
  body: API.SpaceQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSpace_>('/api/space/list/space', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getListSpaceByVo POST /api/space/list/space/vo */
export async function getListSpaceByVoUsingPost(
  body: API.SpaceQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSpaceVO_>('/api/space/list/space/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateSpace POST /api/space/update */
export async function updateSpaceUsingPost(
  body: API.SpaceUpdateDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/space/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

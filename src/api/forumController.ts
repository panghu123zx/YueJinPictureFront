// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addForum POST /api/forum/add */
export async function addForumUsingPost(body: API.ForumAddDto, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/forum/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** addForumFile POST /api/forum/addfile */
export async function addForumFileUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addForumFileUsingPOSTParams,
  body: {},
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.BaseResponseForumFile_>('/api/forum/addfile', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** addForumFileUrl POST /api/forum/addfileurl */
export async function addForumFileUrlUsingPost(
  body: API.ForumFileAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseForumFile_>('/api/forum/addfileurl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listForumCategory GET /api/forum/category */
export async function listForumCategoryUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponsePictureTagCategory_>('/api/forum/category', {
    method: 'GET',
    ...(options || {}),
  })
}

/** deleteForum POST /api/forum/delete */
export async function deleteForumUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/forum/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteForumFile POST /api/forum/deletefile */
export async function deleteForumFileUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/forum/deletefile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteForumFileList POST /api/forum/deletefilelist */
export async function deleteForumFileListUsingPost(
  body: API.ForumFileDeleteDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/forum/deletefilelist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getForum GET /api/forum/get */
export async function getForumUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getForumUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseForum_>('/api/forum/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** getForumVO GET /api/forum/get/vo */
export async function getForumVoUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getForumVOUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseForumVO_>('/api/forum/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listForum POST /api/forum/list */
export async function listForumUsingPost(
  body: API.ForumQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageForum_>('/api/forum/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getMyListForumByVo POST /api/forum/list/myforum/vo */
export async function getMyListForumByVoUsingPost(
  body: API.ForumQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageForumVO_>('/api/forum/list/myforum/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listForumVo POST /api/forum/list/vo */
export async function listForumVoUsingPost(
  body: API.ForumQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageForumVO_>('/api/forum/list/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** queryForumFile POST /api/forum/queryfile */
export async function queryForumFileUsingPost(
  body: API.ForumFileQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListForumFile_>('/api/forum/queryfile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** reviewForum POST /api/forum/review */
export async function reviewForumUsingPost(
  body: API.ForumReviewDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/forum/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateForum POST /api/forum/update */
export async function updateForumUsingPost(
  body: API.ForumUpdateDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/forum/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

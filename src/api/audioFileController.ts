// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addAudioFile POST /api/audio/add */
export async function addAudioFileUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addAudioFileUsingPOSTParams,
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

  return request<API.BaseResponseLong_>('/api/audio/add', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** deleteAudioFile POST /api/audio/delete */
export async function deleteAudioFileUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/audio/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listAudioFileVo POST /api/audio/list/vo */
export async function listAudioFileVoUsingPost(
  body: API.AudioFileQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageAudioFileVO_>('/api/audio/list/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateAudioFile POST /api/audio/update */
export async function updateAudioFileUsingPost(
  body: API.AudioFileUpdateDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/audio/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** backMessage POST /api/chatmessage/delete */
export async function backMessageUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/chatmessage/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getHistoryMessages GET /api/chatmessage/get/his */
export async function getHistoryMessagesUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/chatmessage/get/his', {
    method: 'GET',
    ...(options || {}),
  })
}

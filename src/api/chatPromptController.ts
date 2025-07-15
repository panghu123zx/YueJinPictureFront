// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** updateChatPrompt POST /api/chatprompt/add */
export async function updateChatPromptUsingPost1(
  body: API.ChatPromptAddDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/chatprompt/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** cleanChatPrompt POST /api/chatprompt/clean */
export async function cleanChatPromptUsingPost(
  body: API.ChatPromptQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/chatprompt/clean', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getListChatPromptVO POST /api/chatprompt/list/vo */
export async function getListChatPromptVoUsingPost(
  body: API.ChatPromptQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageChatPromptVO_>('/api/chatprompt/list/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateChatPrompt POST /api/chatprompt/update */
export async function updateChatPromptUsingPost(
  body: API.ChatPromptUpdateDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/chatprompt/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

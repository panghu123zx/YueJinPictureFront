// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addComment POST /api/comment */
export async function addCommentUsingPost(
  body: API.AddCommentDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteComment POST /api/comment/delete */
export async function deleteCommentUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/comment/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getCommentHistoryMy POST /api/comment/get/history */
export async function getCommentHistoryMyUsingPost(
  body: API.CommentQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageCommentVO_>('/api/comment/get/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getTargetComment POST /api/comment/get/target */
export async function getTargetCommentUsingPost(
  body: API.CommentQueryDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListCommentVO_>('/api/comment/get/target', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** likeComment POST /api/comment/like/comment */
export async function likeCommentUsingPost(
  body: API.LikeCommentDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/comment/like/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** readComment POST /api/comment/read */
export async function readCommentUsingPost(
  body: API.CommentReadDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/comment/read', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

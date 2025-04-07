// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** spaceCategoryAnalyze POST /api/analyze/category/analyze */
export async function spaceCategoryAnalyzeUsingPost(
  body: API.SpaceCategoryAnalyzeDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceCategoryAnalyzeVo_>('/api/analyze/category/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** spaceAnalyze POST /api/analyze/rank */
export async function spaceAnalyzeUsingPost(
  body: API.SpaceRankAnalyzeDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpace_>('/api/analyze/rank', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** spaceSizeAnalyze POST /api/analyze/size/analyze */
export async function spaceSizeAnalyzeUsingPost(
  body: API.SpaceSizeAnalyzeDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceSizeAnalyzeVo_>('/api/analyze/size/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** spaceUsageAnalyze POST /api/analyze/spaceusage */
export async function spaceUsageAnalyzeUsingPost(
  body: API.SpaceUsageAnalyzeDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceUsageAnalyzeVo_>('/api/analyze/spaceusage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** spaceTagAnalyze POST /api/analyze/tag/analyze */
export async function spaceTagAnalyzeUsingPost(
  body: API.SpaceTagAnalyzeDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceTagAnalyzeVo_>('/api/analyze/tag/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** spaceUserAnalyze POST /api/analyze/user/analyze */
export async function spaceUserAnalyzeUsingPost(
  body: API.SpaceUserAnalyzeDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceUserAnalyzeVo_>('/api/analyze/user/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

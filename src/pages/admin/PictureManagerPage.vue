<template>
  <a-flex justify="space-between">
    <h2>图片管理</h2>
    <a-button type="primary" @click="router.push('/addpicture/batch')">批量获取图片</a-button>
  </a-flex>

  <!--  搜索-->
  <a-form layout="inline" :model="searchParams">
    <a-form-item label="关键词">
      <a-input v-model:value="searchParams.searchText" placeholder="请输入关键词..." />
    </a-form-item>
    <a-form-item label="分类" name="category">
      <a-select
        v-model:value="searchParams.category"
        placeholder="请输入分类"
        style="min-width: 180px"
        allow-clear
      >
        <a-select-option v-for="cat in categoryTagList?.categoryList" :key="cat">{{
          cat
        }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item name="tags" label="标签">
      <a-select
        v-model:value="searchParams.tags"
        mode="tags"
        placeholder="请输入标签"
        style="min-width: 180px"
        allow-clear
      >
        <a-select-option v-for="tag in categoryTagList?.tagList" :key="tag">{{
          tag
        }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="审核状态" name="reviewStatus">
      <a-select
        v-model:value="searchParams.reviewStatus"
        placeholder="请输入审核状态"
        style="min-width: 180px"
        allow-clear
      >
        <a-select-option :key="1">通过</a-select-option>
        <a-select-option :key="2">拒绝</a-select-option>
        <a-select-option :key="0">待审核</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="doSearch">搜索</a-button>
    </a-form-item>
  </a-form>
  <div style="margin-bottom: 16px"></div>
  <!--  数据-->
  <a-table
    :columns="columns"
    :data-source="dataList"
    :pagination="paginationParams"
    @change="doPagination"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'url'">
        <a-image :src="record.url" :width="100" />
      </template>
      <template v-if="column.dataIndex === 'picInfo'">
        <div>宽度：{{ record.picWidth }}</div>
        <div>高度：{{ record.picHeight }}</div>
        <div>格式：{{ record.picFormat }}</div>
        <div>宽高比：{{ record.picScale }}</div>
        <div>大小：{{ (record.picSize / 1024).toFixed(2) }}KB</div>
      </template>
      <template v-if="column.dataIndex === 'reviewMessage'">
        <div>审核人：{{ record.reviewerId }}</div>
        <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
        <div>审核信息：{{ record.reviewMessage }}</div>
      </template>
      <template v-if="column.dataIndex === 'category'">
        <a-tag color="green">{{ record.category || '' }}</a-tag>
      </template>
      <template v-if="column.dataIndex === 'tags'">
        <a-space wrap>
          <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{ tag }}</a-tag>
        </a-space>
      </template>
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-if="column.dataIndex === 'editTime'">
        {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-space wrap>
            <a-button @click="router.push(`/addpicture?id=${record.id}`)">编辑</a-button>
            <a-button
              type="primary"
              v-if="record.reviewStatus === PIC_REVIEW_STATUS_ENUM.REVIEWING"
              @click="doReview(record.id, PIC_REVIEW_STATUS_ENUM.PASS)"
              >通过</a-button
            >
            <a-button
              danger
              v-if="record.reviewStatus === PIC_REVIEW_STATUS_ENUM.REVIEWING"
              type="link"
              @click="doReview(record.id, PIC_REVIEW_STATUS_ENUM.REJECT)"
              >拒绝</a-button
            >
            <a-button type="primary" danger @click="doDeletePicture(record.id)">删除</a-button>
          </a-space>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

import {
  deletePictureUsingPost,
  getListPictureUsingPost,
  listPictureTagCategoryUsingGet,
  pictureReviewUsingPost,
} from '../../api/pictureController'
import { PIC_REVIEW_STATUS_ENUM, PIC_REVIEW_STATUS_MAP } from '../../constants/picture'
import { useRouter } from 'vue-router'

const router = useRouter()

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

//初始数据
const dataList = ref<API.PictureQueryDto[]>([])
const total = ref(0)
const categoryTagList = ref<API.PictureTagCategory>()
/**
 * 搜索条件
 */
const searchParams = reactive<API.PictureQueryDto>({
  current: 1,
  pageSize: 5,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const paginationParams = computed(() => {
  return {
    total: total.value,
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    showSizeChanger: true,
    showTotal: (total) => `共${total}条`,
  }
})

/**
 * 初始化数据
 */
const fetchPictureList = async () => {
  const res = await getListPictureUsingPost({
    ...searchParams,
    queryPublic: true,
  })
  if (res.code === 0) {
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取数据失败' + res.message)
  }
}

const fetchCategoryAndTags = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.code === 0) {
    categoryTagList.value = res.data
  }
}

/**
 * 页面加载时获取数据
 */
onMounted(() => {
  fetchCategoryAndTags()
  fetchPictureList()
})
/**
 * 删除pic
 */
const doDeletePicture = async (id) => {
  if (!id) {
    message.error('删除失败')
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
  fetchPictureList()
}
/**
 * 搜索
 */
const doSearch = async () => {
  searchParams.current = 1
  await fetchPictureList()
}

/**
 * 分页
 */
const doPagination = async (page) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchPictureList()
}

const doReview = async (id, status) => {
  const reviewMessage = status === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'

  const res = await pictureReviewUsingPost({
    id: id,
    reviewStatus: status,
    reviewMessage,
  })
  if (res.code === 0) {
    message.success('审核成功')
    fetchPictureList()
  } else {
    message.error('审核失败', res.message)
  }
}
</script>

<style scoped>
.search-button {
}
</style>

<template>
  <a-flex justify='space-between'>
    <h2>论坛管理</h2>
  </a-flex>

  <!--  搜索-->
  <a-form layout='inline' :model='searchParams'>
    <a-form-item label='名称'>
      <a-input v-model:value='searchParams.title' placeholder='请输入名称...' />
    </a-form-item>
    <a-form-item label='分类' name='category'>
      <a-select
        v-model:value='searchParams.category'
        placeholder='请输入分类'
        style='min-width: 180px'
        allow-clear
      >
        <a-select-option v-for='cat in categoryList' :key='cat'>{{ cat }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label='审核状态' name='reviewStatus'>
      <a-select
        v-model:value='searchParams.reviewStatus'
        placeholder='请输入审核状态'
        style='min-width: 180px'
        allow-clear
      >
        <a-select-option :key='1'>通过</a-select-option>
        <a-select-option :key='2'>拒绝</a-select-option>
        <a-select-option :key='0'>待审核</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-button type='primary' @click='doSearch'>搜索</a-button>
    </a-form-item>
  </a-form>
  <div style='margin-bottom: 16px;'></div>
  <!--  数据-->
  <a-table :columns='columns' :data-source='dataList' :pagination='paginationParams' @change='doPagination'>
    <template #bodyCell='{ column, record }'>
      <template v-if="column.dataIndex === 'reviewMessage'">
        <div>审核人：{{ record.reviewerId }}</div>
        <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
        <div>审核信息：{{ record.reviewMessage }}</div>
      </template>
      <template v-if="column.dataIndex === 'content'">
        {{record.content}}
      </template>
      <template v-if="column.dataIndex === 'category'">
        <a-tag color='green'>{{ record.category || '' }}</a-tag>
      </template>
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-space wrap>
            <a-button @click='router.push(`/addforum?id=${record.id}`)'>编辑</a-button>
          <a-button type='primary' v-if='record.reviewStatus===PIC_REVIEW_STATUS_ENUM.REVIEWING'
                    @click='doReview(record.id,PIC_REVIEW_STATUS_ENUM.PASS)'>
            通过
          </a-button>
          <a-button danger v-if='record.reviewStatus===PIC_REVIEW_STATUS_ENUM.REVIEWING' type='link'
                    @click='doReview(record.id,PIC_REVIEW_STATUS_ENUM.REJECT)'>
            拒绝
          </a-button>
          <a-button type='primary' danger @click='doDeleteForum(record.id)'>删除</a-button>
          </a-space>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang='ts' setup>
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteUserUsingPost, getListUserByPageUsingPost } from '../../api/userController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  deletePictureUsingPost,
  getListPictureUsingPost,
  listPictureTagCategoryUsingGet, pictureReviewUsingPost
} from '../../api/pictureController'
import { PIC_REVIEW_STATUS_ENUM, PIC_REVIEW_STATUS_MAP } from '../../constants/picture'
import { useRouter } from 'vue-router'
import {
  deleteForumUsingPost,
  listForumCategoryUsingGet,
  listForumUsingPost,
  reviewForumUsingPost
} from '../../api/forumController'


const router = useRouter()


const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '名称',
    dataIndex: 'title'
  },
  {
    title: '内容',
    dataIndex: 'content',
    ellipsis: true
  },
  {
    title: '类型',
    dataIndex: 'category'
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    key: 'action'
  }
]


//初始数据
const dataList = ref<API.ForumQueryDto[]>([])
const total = ref(0)
const categoryList = ref([])
/**
 * 搜索条件
 */
const searchParams = reactive<API.ForumQueryDto>({
  current: 1,
  pageSize: 5,
  sortField: 'createTime',
  sortOrder: 'descend'
})

const paginationParams = computed(() => {
  return {
    total: total.value,
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    showSizeChanger: true,
    showTotal: (total) => `共${total}条`
  }
})


/**
 * 初始化数据
 */
const fetchForumList = async () => {
  const res = await listForumUsingPost({
    ...searchParams
  })
  if (res.code === 0) {
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取数据失败' + res.message)
  }
}

const fetchCategory = async () => {
  const res = await listForumCategoryUsingGet()
  if (res.code === 0) {
    categoryList.value = res.data.categoryList
  }
}


/**
 * 页面加载时获取数据
 */
onMounted(() => {
  fetchCategory()
  fetchForumList()
})
/**
 * 删除forum
 */
const doDeleteForum = async (id) => {
  if (!id) {
    message.error('删除失败')
    return
  }
  const res = await deleteForumUsingPost({ id })
  if (res.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
  fetchForumList()
}
/**
 * 搜索
 */
const doSearch = async () => {
  searchParams.current = 1
  await fetchForumList()
}

/**
 * 分页
 */
const doPagination = async (page) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchForumList()
}

/**
 * 审核
 * @param id
 * @param status
 */
const doReview = async (id, status) => {
  const reviewMessage = status === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'

  const res = await reviewForumUsingPost({
    id: id,
    reviewStatus: status,
    reviewMessage
  })
  if (res.code === 0) {
    message.success('审核成功')
    fetchForumList()
  } else {
    message.error('审核失败', res.message)
  }
}
</script>

<style scoped>
.search-button {

}

</style>

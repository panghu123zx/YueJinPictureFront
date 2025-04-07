<template>
  <a-flex justify='space-between'>
    <h2>空间管理</h2>
    <a-space>
      <a-button type='primary' @click='router.push("/addspace")'>+ 创建空间</a-button>
      <a-button type='primary' ghost :href='`/space_analyze?queryPublic=true`'>分析公共空间</a-button>
      <a-button type='primary' ghost :href='`/space_analyze?queryAll=true`'>分析全部空间</a-button>
    </a-space>
  </a-flex>
  <div style='margin-bottom: 16px;'></div>
  <!--  搜索-->
  <a-form layout='inline' :model='searchParams'>
    <a-form-item label='空间名称' name='spaceName'>
      <a-input v-model:value='searchParams.spaceName' placeholder='请输入空间名称' />
    </a-form-item>
    <a-form-item label='空间级别' name='spaceLevel'>
      <a-select
        v-model:value='searchParams.spaceLevel'
        placeholder='请输入空间级别'
        :options='SPACE_LEVEL_OPTIONS'
        style='min-width: 180px'
        allow-clear
      />
    </a-form-item>
    <a-form-item label='空间类别' name='spaceType'>
      <a-select
        v-model:value='searchParams.spaceType'
        placeholder='请输入空间类别'
        :options='SPACE_TYPE_OPTIONS'
        style='min-width: 180px'
        allow-clear
      />
    </a-form-item>
    <a-form-item label='用户 id' name='userId'>
      <a-input v-model:value='searchParams.userId' placeholder='请输入用户 id' allow-clear />
    </a-form-item>
    <a-form-item>
      <a-button type='primary' @click='doSearch'>搜索</a-button>
    </a-form-item>
  </a-form>
  <div style='margin-bottom: 16px;'></div>
  <!--  数据-->
  <a-table :columns='columns' :data-source='dataList' :pagination='paginationParams' @change='doPagination'>
    <template #bodyCell='{ column, record }'>
      <template v-if='column.dataIndex === "spaceLevel"'>
        {{ SPACE_LEVEL_MAP[record.spaceLevel] }}
      </template>
      <template v-if='column.dataIndex === "spaceType"'>
        {{ SPACE_TYPE_MAP[record.spaceType] }}
      </template>
      <template v-if='column.dataIndex === "spaceInfo"'>
        大小: {{ formatSize(record.totalSize) }}/{{ formatSize(record.maxSize) }}
        数量: {{ record.totalCount }} /{{ record.maxCount }}
      </template>
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a-button danger @click='doDeleteSpace(record.id)'>删除</a-button>
          <a-button type='link' @click='router.push(`/addspace?id=${record.id}`)'>编辑</a-button>
        </a-space>
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
import Api from '@vitejs/plugin-vue'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_ENUM, SPACE_LEVEL_OPTIONS } from '../../constants/space'
import { formatSize } from '../../utils/index'
import { deleteSpaceUsingPost, getListSpaceUsingPost } from '../../api/spaceController'
import { useRouter } from 'vue-router'
import  {SPACE_TYPE_MAP,SPACE_TYPE_OPTIONS} from '../../constants/spaceuser'


const router = useRouter()

const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName'
  },
  {
    title: '空间等级',
    dataIndex: 'spaceLevel'
  },
  {
    title: '空间类别',
    dataIndex: 'spaceType'
  },
  {
    title: '使用情况',
    dataIndex: 'spaceInfo'
  },
  {
    title: '创建人id',
    dataIndex: 'userId'
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
const dataList = ref<API.SpaceQueryDto[]>([])
const total = ref(0)
/**
 * 搜索条件
 */
const searchParams = reactive<API.SpaceQueryDto>({
  current: 1,
  pageSize: 6,
  sortField: 'createTime',
  sortOrder: 'ascend'
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
const fetchSpaceList = async () => {
  const res = await getListSpaceUsingPost({
    ...searchParams
  })
  if (res.code === 0) {
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取数据失败' + res.message)
  }
}

/**
 * 页面加载时获取数据
 */
onMounted(() => {
  fetchSpaceList()
})
/**
 * 删除空间
 */
const doDeleteSpace = async (id) => {
  if (!id) {
    message.error('删除失败')
    return
  }
  const res = await deleteSpaceUsingPost({ id })
  if (res.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
  fetchSpaceList()
}
/**
 * 搜索
 */
const doSearch = async () => {
  searchParams.current = 1
  await fetchSpaceList()
}

/**
 * 分页
 */
const doPagination = async (page) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchSpaceList()
}
</script>

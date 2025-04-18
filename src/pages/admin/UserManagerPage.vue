<template>
  <!--  搜索-->
  <a-form layout='inline' :model='searchParams'>
    <a-form-item label='账号'>
      <a-input v-model:value='searchParams.userAccount' placeholder='请输入账号' />
    </a-form-item>
    <a-form-item label='用户名'>
      <a-input v-model:value='searchParams.userName' placeholder='请输入用户名' />
    </a-form-item>
    <a-form-item>
      <a-button type='primary' @click='doSearch'>搜索</a-button>
    </a-form-item>
  </a-form>
  <div style='margin-bottom: 16px;'></div>
  <!--  数据-->
  <a-table :columns='columns' :data-source='dataList' :pagination='paginationParams' @change='doPagination'>
    <template #bodyCell='{ column, record }'>
      <template v-if="column.dataIndex === 'userAvatar'">
        <a-image :src='record.userAvatar ' :width='100' />
      </template>
      <template v-else-if="column.dataIndex === 'userRole'">
        <span v-if='record.userRole==="admin"'>
          <a-tag color='green'>管理员</a-tag>
        </span>
        <span v-else>
          <a-tag color='blue'>普通用户</a-tag>
        </span>
      </template>
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button danger @click='doDeleteUser(record.id)'>删除</a-button>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang='ts' setup>
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteUserUsingPost, getListUserByPageUsingPost, updateUserUsingPost } from '../../api/userController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

import { editSpaceUserUsingPost } from '../../api/spaceUserController'


const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '账号',
    dataIndex: 'userAccount'
  },
  {
    title: '用户名',
    dataIndex: 'userName'
  },
  {
    title: '头像',
    dataIndex: 'userAvatar'
  },
  {
    title: '简介',
    dataIndex: 'userProfile'
  },
  {
    title: '权限',
    dataIndex: 'userRole'
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
const dataList = ref<API.UserQueryDto[]>([])
const total = ref(0)
/**
 * 搜索条件
 */
const searchParams = reactive<API.UserQueryDto>({
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
const fetchUserList = async () => {
  const res = await getListUserByPageUsingPost({
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
  fetchUserList()
})
/**
 * 删除用户
 */
const doDeleteUser = async (id) => {
  if (!id) {
    message.error('删除失败')
    return
  }
  const res = await deleteUserUsingPost({ id })
  if (res.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
  fetchUserList()
}
/**
 * 搜索
 */
const doSearch = async () => {
  searchParams.current = 1
  await fetchUserList()
}

/**
 * 分页
 */
const doPagination = async (page) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchUserList()
}

</script>

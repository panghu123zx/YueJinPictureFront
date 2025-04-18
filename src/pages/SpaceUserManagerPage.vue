<template>
  <!--  搜索-->
  <h2>空间成员管理</h2>
  <a-form layout="inline" :model="addParams">
    <a-form-item label="用户id">
      <a-input v-model:value="addParams.userId" placeholder="请输入用户id" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="doAddUser">添加用户</a-button>
    </a-form-item>
  </a-form>
  <div style="margin-bottom: 16px" />
  <!--  数据-->
  <a-table :columns="columns" :data-source="dataList">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'userInfo'">
        <a-avatar :src="record.user?.userAvatar" />
        {{ record.user?.userName }}
      </template>
      <template v-if="column.dataIndex === 'spaceRole'">
        <a-select
          v-model:value="record.spaceRole"
          v-if="record.spaceRole !== SPACE_ROLE_ENUM.ADMIN"
          :options="SPACE_ROLE_OPTIONS"
          @change="(value) => doChangeSpaceRole(value, record)"
        />
        <a-tag v-else color="green">管理员</a-tag>
      </template>
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button danger @click="doDeleteUser(record.id)">删除</a-button>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { defineProps, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  getListSpaceUserByVoUsingPost,
} from '../api/spaceUserController'
import { SPACE_ROLE_ENUM, SPACE_ROLE_OPTIONS } from '../constants/spaceuser'

interface Props {
  id: string
}

const props = defineProps<Props>()

const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
  },

  {
    title: '创建时间',
    dataIndex: 'createTime',
  },

  {
    title: '操作',
    key: 'action',
  },
]

//初始数据
const dataList = ref<API.SpaceUserVO[]>([])
/**
 * 搜索条件
 */
const addParams = ref<API.SpaceUserAddDto>({})

/**
 * 初始化数据
 */
const fetchData = async () => {
  const spaceId = props.id
  if (!spaceId) return

  const res = await getListSpaceUserByVoUsingPost({
    spaceId: spaceId as number,
  })
  if (res.code === 0) {
    dataList.value = res.data ?? []
  } else {
    message.error('获取数据失败' + res.data)
  }
}

/**
 * 页面加载时获取数据
 */
onMounted(() => {
  fetchData()
})
/**
 * 删除用户
 */
const doDeleteUser = async (id) => {
  if (!id) {
    message.error('删除失败')
    return
  }
  const res = await deleteSpaceUserUsingPost({ id })
  if (res.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
  fetchData()
}
/**
 * 搜索
 */
const doAddUser = async () => {
  const id = addParams.value.userId
  if (!id) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId: props.id as number,
    userId: id,
    spaceRole: SPACE_ROLE_ENUM.VIEWER,
  })
  if (res.code === 0) {
    message.success('添加成功')
  } else {
    message.error('添加失败' + res.data)
  }
  fetchData()
}

const doChangeSpaceRole = async (value, record) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceRole: value,
  })
  if (res.code === 0) {
    message.success('修改成功')
  } else {
    message.error('修改失败')
  }
  fetchData()
}
</script>

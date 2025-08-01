<template>
  <div class='comment-my'>
    <a-modal v-model:open='visible' :title='props.follow===0 ? "我的关注" : "我的粉丝"' :footer='false' @cancel='closeModal'>
      <a-list item-layout='horizontal' :data-source='followList' :pagination="pagination">
        <template #renderItem='{ item }'>
          <a-list-item style='border: 1px solid #f4dada; border-radius: 10px; margin-bottom: 16px;'>
            <a-list-item-meta
              :description='item.followerVO?.userProfile'
            >
              <template #title>
                <a>{{ item.followerVO?.userName }}</a>
              </template>
              <template #avatar>
                <a-avatar :src='item.followerVO?.userAvatar' />
              </template>

            </a-list-item-meta>
            <template #extra>
              <a-button v-if='props.follow===0' @click='undoFollow(item,1)'>取消关注</a-button>
              <a-button v-else @click='undoFollow(item,0)'>互关</a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>
      <!--    分页插件-->
      <a-pagination style='text-align: right;'
                    v-model:current='searchParams.current'
                    :total='total'
                    v-model:pageSize='searchParams.pageSize'
                    :showTotal='(total)=> `共 ${total} 条数据`'
                    :onChange='doChangePages' />
    </a-modal>
  </div>
</template>

<script lang='ts' setup>
import { defineExpose, defineProps, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { getCommentHistoryMyUsingPost } from '../api/commentController'
import { LikeFilled } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { addFollowUsingPost, getFollowMyUsingPost } from '../api/followController'

interface Props{
  id: number | string,
  follow: number
}

const props = defineProps<Props>()

const visible = ref(false)
const followList = ref<API.FollowVO[]>([])
const total = ref()

const searchParams = ref({
  current: 1,
  pageSize: 5
})

//图片的分页
const doChangePages = (page, pageSize) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchFollow()
}


const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}
//获取关注/粉丝
const fetchFollow = async () => {
  const res = await getFollowMyUsingPost({
    ...searchParams.value,
    queryStatus: props.follow
  })
  if (res.code === 0 && res.data) {
    followList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取信息失败'+res.data)
  }
}

//取消关注
const undoFollow = async (item,statu) => {
  const res = await addFollowUsingPost({
    userId: item.id,
    followerId: props.id,
    status: statu
  })
  if (res.code !== 0) {
    message.error(res.data)
  }
  fetchFollow()
}


//暴露函数
defineExpose({
  openModal,
  fetchFollow
})
</script>

<style scoped>
.comment-my {
}
</style>

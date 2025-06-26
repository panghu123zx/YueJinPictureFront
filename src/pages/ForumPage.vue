<template>
  <div id='ForumPage'>
    <div class='header'>
      <img src='../assets/searchLogo.jpg' alt='' height='135px' width='100%'>
    </div>
    <div class='content'>
      <a-list
        :grid='{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }'
        :data-source='dataList'
        :pagination='pagination'
        :loading='loading'
      >
        <template #renderItem='{item :forum}'>
          <a-list-item style='padding: 10px'>
            <a-card hoverable style='width: 240px;' @click='doForumDetail(forum)'>
              <template #cover>
                <img :alt='forum.title' :src='forum.thumbnailUrl ?? forum.url'
                     style='height: 370px;object-fit: cover' loading='lazy' />
                <div class='forumTitle'>{{ forum.title }}</div>
                <div class='forumUser'>
                  <a-avatar :src='forum.userVO?.userAvatar' size='small' />
                  <span style='color: #e0d7d7;margin-left: 5px;font-size: 11px'>{{ forum.userVO?.userName }}</span>
                </div>
                <div class='category'>
                  <a-tag :bordered='false' style='background: rgb(72 78 74 / 50%);color: white'>{{ forum.category }}
                  </a-tag>
                </div>
                <div class='time'>
                  {{ dayjs(forum.createTime).format('MM月DD日 HH:mm') }}
                </div>
              </template>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang='ts'>

import { computed, onMounted, ref } from 'vue'
import { listForumVoUsingPost } from '../api/forumController'
import ForumQueryDto = API.ForumQueryDto
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

//:pagination='paginationParams'

const loading = ref<boolean>(false)
const dataList = ref<API.ForumVO[]>([])
const total = ref()
const router=useRouter()

const pagination = computed(()=>{
  return{
    total: total.value,
    current: searchParams.value.current,
    pageSize: searchParams.value.pageSize,
    showTotal: (total) => `共${total}条`,
  }
})

const searchParams = ref<ForumQueryDto>({
  current: 1,
  pageSize: 10
})

const fetchForumData = async () => {
  loading.value = true
  const res = await listForumVoUsingPost({
    ...searchParams.value
    // reviewStatus: 1
  })
  if (res.code === 0 && res.data) {
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  }
  loading.value = false
}

onMounted(() => {
  fetchForumData()
})


const doForumDetail=(forum)=>{
  router.push({
    path:`/forum/${forum.id}`,
  })
}

</script>


<style scoped>
#ForumPage {
}

.forumTitle {
  position: absolute;
  left: 3%;
  top: 78%;
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.forumUser {
  position: absolute;
  top: 90%;
  left: 1%;
  color: white;
}

.category {
  position: absolute;
  left: 78%;
  top: 78%;
}

.time {
  position: absolute;
  top: 91%;
  left: 60%;
  color: rgba(255, 255, 255, 0.7);
  font-size: small;
}
</style>

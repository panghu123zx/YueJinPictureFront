<template>
  <div id='ForumPage'>
    <div class='header'>
      <img src='../assets/searchLogo.jpg' alt='' height='135px' width='100%'>
    </div>
    <div class='content'>
      <a-list
        :grid='{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }'
        :data-source='dataList'
        :loading='loading'
      >
        <template #renderItem='{item :forum}'>
          <a-list-item style='padding: 10px'>
            <a-card hoverable style='width: 240px;' @click='doPictureDetail(forum)'>
              <template #cover>
                <img :alt='forum.title' :src='forum.thumbnailUrl ?? forum.url'
                     style='height: 180px;object-fit: cover' loading='lazy' />
              </template>
              <a-card-meta :title='forum.title'>
                <template #description>
                  <a-flex>
                    <a-tag color='green'>{{ forum.category ?? '默认' }}</a-tag>
                  </a-flex>
                </template>
              </a-card-meta>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang='ts'>

import { onMounted, ref } from 'vue'
import { listForumVoUsingPost } from '../api/forumController'
import ForumQueryDto = API.ForumQueryDto

//:pagination='paginationParams'

const loading = ref<boolean>(false)
const dataList = ref<API.ForumVO[]>([])
const total = ref()

const searchParams = ref<ForumQueryDto>({
  current: 1,
  pageSize: 10
})

const fetchForumData = async () => {
  loading.value = true
  const res = await listForumVoUsingPost({
    ...searchParams.value,
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

</script>


<style scoped>
#ForumPage {
}
</style>

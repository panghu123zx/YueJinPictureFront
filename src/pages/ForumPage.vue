<template>
  <div id='ForumPage'>
    <div class='header'>
      <a-space style='margin-top: 16px; margin-left: 10px;'>
        <a-button>发现</a-button>
        <a-button>关注</a-button>
      </a-space>
      <a-tabs v-model:activeKey='selectCategory' @change='doSearch' style='margin-top: 25px; margin-left: -4px;' >
        <a-tab-pane key='all' tab='全部'  class="no-underline-tabs" />
        <a-tab-pane v-for='cat in categoryList' :key='cat' :tab='cat'/>
      </a-tabs>
    </div>
    <div class='content'>
      <a-list
        :grid='{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }'
        :data-source='dataList'
        :loading='loading'
      >
        <template #renderItem='{item :forum}'>
          <a-list-item style='padding: 10px'>
            <a-card hoverable style='width: 240px;' @click='doForumDetail(forum)'>
              <template #cover>
                <img :alt='forum.title' :src='forum?.forumFile[0]?.thumbnailUrl ?? forum?.forumFile[0]?.picUrl'
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
      <!--    分页插件-->
      <a-pagination style='text-align: right;'
                    v-model:current='searchParams.current'
                    :total='total'
                    v-model:pageSize='searchParams.pageSize'
                    :onChange='doChangePages' />
    </div>
  </div>
</template>

<script setup lang='ts'>

import { computed, onMounted, ref } from 'vue'
import { listForumCategoryUsingGet, listForumVoUsingPost } from '../api/forumController'
import ForumQueryDto = API.ForumQueryDto
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'


const loading = ref<boolean>(false)
const dataList = ref<API.ForumVO[]>([])
const total = ref()
const router = useRouter()
const categoryList = ref()
const selectCategory = ref('all')


const searchParams = ref<ForumQueryDto>({
  current: 1,
  pageSize: 10
})

const fetchData=async ()=> {
  loading.value= true
  const params = {
    ...searchParams.value
  }
  if(selectCategory.value !== 'all') {
    params.category = selectCategory.value
  }
  const res = await listForumVoUsingPost(params)
  if(res.code=== 0 && res.data){
    dataList.value = res.data.records ?? []
  }else{
    message.error("搜索失败")
  }

  loading.value=false
}

//图片的分页
const doChangePages = (page, pageSize) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchForumData()
}

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

const fetchCategory = async () => {
  const res = await listForumCategoryUsingGet()
  if (res.code === 0 && res.data) {
    categoryList.value = res.data.categoryList
  }
}

onMounted(() => {
  fetchForumData()
  fetchCategory()
})


const doForumDetail = (forum) => {
  router.push({
    path: `/forum/${forum.id}`
  })
}

const doSearch = () => {
  loading.value= true
  searchParams.value.current = 1
  dataList.value= []
  fetchData()
  loading.value= false
}

</script>


<style scoped>
#ForumPage {
}

.header {
  height: 135px;
  width: 100%;
  background-image: url("../assets/searchLogo.jpg");
  margin-bottom: 16px;
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
:deep(:where(.css-dev-only-do-not-override-1p3hq3p).ant-tabs .ant-tabs-tab){
  width: 63px;
  background-color: #f5f7fa;
  padding-left: 17px;
  border-radius: 15px;
  height: 36px;
  margin-left: 15px;
}

:deep(:where(.css-dev-only-do-not-override-1p3hq3p).ant-tabs .ant-tabs-tab-active){
  background-color: #c68585;
  color: white;
}

:deep(:where(.css-dev-only-do-not-override-1p3hq3p).ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn){
  color: white;
}
.no-underline-tabs .ant-tabs-ink-bar {
  display: none !important;
}
</style>

<template>
  <div id='ForumPage'>
    <div class='header'>
      <div class='search-bar'>
        <a-input-search
          v-model:value='searchParams.title'
          placeholder='搜索你想要的帖子'
          enter-button
          size='large'
          @search='doSearch'
        />
      </div>
      <a-space style='margin-top: 8px; margin-left: 10px;'>
        <a-button @click='getAll' :class='{"btn-back" : changeAll===0}'>发现</a-button>
        <a-button @click='getFollow' :class='{"btn-back" : changeAll===1}' >关注</a-button>
      </a-space>
      <a-tabs
        v-model:activeKey='selectCategory'
        @change='doSearch'
        style='margin-top: 25px; margin-left: -4px;'
        type='card'>
        <a-tab-pane key='all' tab='全部' />
        <a-tab-pane v-for='cat in categoryList' :key='cat' :tab='cat' />
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
                <div class='category'>
                  <a-tag :bordered='false' style='background: rgb(72 78 74 / 50%);color: white'>{{ forum.category }}
                  </a-tag>
                </div>
                <div class='forumUser'>
                  <a-avatar :src='forum.userVO?.userAvatar' size='small' />
                  <span style='color: #e0d7d7;margin-left: 5px;font-size: 11px'>{{ forum.userVO?.userName }}</span>
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
import { getFollowForUsingPost, listForumCategoryUsingGet, listForumVoUsingPost } from '../api/forumController'
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
//0-发现，1-关注
const changeAll=ref(0)


const searchParams = ref<ForumQueryDto>({
  current: 1,
  pageSize: 10
})

/**
 * 点击分类时是搜索
 */
const fetchData = async () => {
  loading.value = true
  const params = {
    ...searchParams.value
  }
  if (selectCategory.value !== 'all') {
    params.category = selectCategory.value
  }
  let res;
  if(changeAll.value===0){
    res = await listForumVoUsingPost(params)
  }else{
    res = await getFollowForUsingPost(params)
  }

  if (res.code === 0 && res.data) {
    dataList.value = res.data.records ?? []
  } else {
    message.error('搜索失败')
  }

  loading.value = false
}

//图片的分页
const doChangePages = (page, pageSize) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

/**
 * 初始化数据
 */
const fetchForumData = async () => {
  loading.value = true
  const res = await listForumVoUsingPost({
    ...searchParams.value
  })
  if (res.code === 0 && res.data) {
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  }
  loading.value = false
}

/**
 * 获取全部
 */
const getAll=async ()=>{
  changeAll.value=0
  searchParams.value.current=1
  await fetchData()
}

/**
 * 获取我关注的用户的帖子
 */
const getFollow= async ()=>{
  changeAll.value=1
  searchParams.value.current=1
  await fetchData()
}

/**
 * 获取分类
 */
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

/**
 * 详情
 */
const doForumDetail = (forum) => {
  router.push({
    path: `/forum/${forum.id}`
  })
}

/**
 * 搜索
 */
const doSearch = () => {
  loading.value = true
  searchParams.value.current = 1
  dataList.value = []
  fetchData()
  loading.value = false
}

</script>


<style scoped>
#ForumPage {
}

.search-bar {
  max-width: 480px;
  margin: 0 auto;
  padding-top: 16px;
}

.header {
  height: 175px;
  width: 100%;
  background-image: url("../assets/searchLogo.jpg");
  margin-bottom: 16px;
}
.btn-back{
  background-color: #c68585;
  color: white;
  border: none;
}

.forumTitle {
  position: absolute;
  left: 3%;
  top: 78%;
  color: white;
  font-size: 20px;
  font-weight: 600;
  width: 170px;
}

.forumUser {
  position: absolute;
  top: 90%;
  left: 1%;
  color: white;
}

.category {
  width: 35px;
  position: absolute;
  left: 78%;
  bottom: 15%;
}

.time {
  width: 94px;
  position: absolute;
  left: 61%;
  bottom: 4%;
  color: rgba(255, 255, 255, 0.7);
  font-size: small;
}

:deep(.ant-tabs .ant-tabs-tab) {
  width: 63px;
  height: 36px;
  margin-left: 15px;
  padding-left: 17px;
  background-color: #f5f7fa;
  border-radius: 15px !important;
}

:deep(.ant-tabs .ant-tabs-tab-active) {
  background-color: #c68585;
  color: white;
}

:deep(.ant-tabs .ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: white;
}

:deep(
  .ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab,
  .ant-tabs-card.ant-tabs-bottom > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab,
  .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab,
  .ant-tabs-card.ant-tabs-bottom > div > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab
) {
  margin-left: 10px;
}

:deep(
  .ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab-active,
  .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab-active
) {
  border-bottom-color: #c68585;
}

</style>

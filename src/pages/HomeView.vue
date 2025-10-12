<template>
  <div id='home'>
    <div class='header'>
      <!--    搜索信息-->
      <a-flex justify='space-between'>
        <a-space style='margin-left: 35px;'>
          <a-button @click='getAll' :class='{"btn-back" : changeAll===0}'>发现</a-button>
          <a-button @click='getFollow' :class='{"btn-back" : changeAll===1}' >关注</a-button>
          <a-button @click='getFour' :class='{"btn-back" : changeAll===2}' >4K精选</a-button>
        </a-space>
        <div class='search-bar'>
          <a-input-search
            v-model:value='searchParams.searchText'
            placeholder='从海量图库中搜索'
            enter-button
            size='large'
            @search='doSearch'
          />
        </div>
      </a-flex>
      <a-tabs
        v-model:activeKey='selectCategory'
        @change='doSearch'
        style='margin-left: 16px;'
        type='card'>
        <a-tab-pane key='all' tab='全部' />
        <a-tab-pane v-for='cat in categoryTagList?.categoryList' :key='cat' :tab='cat' />
      </a-tabs>

      <span style='margin-right: 8px;margin-left: 35px; color: white'>标签:</span>
      <a-space :size='[0, 8]' wrap>
        <a-checkable-tag
          v-for='(tag, index) in categoryTagList?.tagList'
          :key='tag'
          v-model:checked='selectTagsList[index]'
          @change='doSearch'
        >
          <span style='color: white'>{{ tag }}</span>
        </a-checkable-tag>
      </a-space>
    </div>
    <!-- 图片列表 -->
    <div v-if='loading'>
      <a-spin size='large' tip='加载中...' />
    </div>
    <div v-else>
      <WaterfallList2 :loading='loading' :dataList='dataList' :showOptions='false' />
    </div>

    <a-empty v-if='dataList.length===0' />

    <a-back-top class='scrollTop'>
      <template #icon>
        <RocketTwoTone />
      </template>
    </a-back-top>
    <div>
      <a-spin v-if='loading' size='large' />
      <div v-if='showBottom'>
        <a-divider v-if='dataList.length>0' style='color: #666666'>
          已经到达底部了
        </a-divider>
        <a-empty v-else :image='Empty.PRESENTED_IMAGE_SIMPLE' />
      </div>
    </div>

  </div>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import {
  getFollowPictureUsingPost,
  getListPictureByVoUsingPost,
  listPictureTagCategoryUsingGet
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { RocketTwoTone } from '@ant-design/icons-vue'
import WaterfallList2 from '../components/WaterfallList2.vue'
import { Empty } from 'ant-design-vue'

const router = useRouter()

const dataList = ref<API.PictureVO[]>([])
const loading = ref<Boolean>(true)

/**
 * 加载完成状态
 */
const loadingFinish = ref(false)
/**
 * 是否显示底部加载
 */
const showBottom = ref(false)

const loadingLock = ref(false)

//获取的标签结果
const categoryTagList = ref<API.PictureTagCategory>()
//选择的分类
const selectCategory = ref<string>('all')
//选择的标签
const selectTagsList = ref<string[]>([])
//0-全部 ，1-关注 2-4K图片
const changeAll=ref(0)

/**
 * 搜索条件
 */
const searchParams = reactive<API.PictureQueryDto>({
  current: 1,
  pageSize: 12,
  homeShow: 'home'
})


/**
 * 获取全部
 */
const getAll =async  () => {
  changeAll.value=0
  dataList.value=[]
  searchParams.is4K=0
  searchParams.current=1
  loadingFinish.value = false
  await fetchPictureData()
}

/**
 * 获取关注
 */
const getFollow = async () => {
  changeAll.value=1
  searchParams.current=1
  searchParams.is4K=0
  dataList.value=[]
  loadingFinish.value = false
  await fetchPictureData()
}

const getFour =async ()=>{
  changeAll.value=2
  searchParams.current=1
  dataList.value=[]
  searchParams.is4K=1
  loadingFinish.value = false
  await fetchPictureData()
}

/**
 * 搜索参数的构造
 */
const fetchData = async () => {
  loading.value = true
  //搜索参数变化
  const params = {
    ...searchParams,
    tags: []
  }
  params.category = undefined
  if (selectCategory.value !== 'all') {
    params.category = selectCategory.value
  }
  selectTagsList.value.forEach((tag, index) => {
    if (tag) {
      params.tags.push(categoryTagList?.value.tagList?.[index])
    }
  })
  //判断获取的是全部图片，还是关注的图片
  let res;
  if(changeAll.value===0 || changeAll.value===2){
    res = await getListPictureByVoUsingPost(params)
  }else{
    res= await getFollowPictureUsingPost(params)
  }
  if (res.data) {
    dataList.value = res.data.records ?? []
  } else {
    message.error('获取数据失败')
  }
  loading.value = false
}


/**
 * 搜索信息
 */
const doSearch = () => {
  loading.value = true
  searchParams.current = 1

  loadingFinish.value = false
  showBottom.value = false
  dataList.value = []
  fetchData()
}


/**
 * 获取图片数据
 */
const fetchPictureData = async () => {
  if (loadingFinish.value || loadingLock.value) return //加载完毕直接返回
  loadingLock.value = true

  if (selectCategory.value !== 'all') {
    searchParams.category = selectCategory.value
  }

  if (selectTagsList.value.length > 0) {
    selectTagsList.value.forEach((tag, index) => {
      if (tag) {
        searchParams.tags.push(categoryTagList?.value.tagList?.[index])
      }
    })
  }
  let res;
  if(changeAll.value===0 || changeAll.value===2){
    res = await getListPictureByVoUsingPost({
      ...searchParams
    })
  }else{
    res= await getFollowPictureUsingPost({
      ...searchParams
    })
  }

  if (res.code === 0 && res.data) {
    const newRecords = res.data.records || []
    dataList.value = [...dataList.value, ...newRecords]

    //判断是否有更多数据
    if (newRecords.length < searchParams.pageSize) {
      loadingFinish.value = true //没有更多数据了
      window.removeEventListener('scroll', handleScroll) //移除监听
      //延迟一秒后展示底线
      setTimeout(() => {
        showBottom.value = true
      }, 1000)
    } else {
      //检查界面高度是否小于屏幕高度
      checkPageHeight()
    }

  } else {
    message.error('获取数据失败' + res.data)
  }
  loading.value = false
  loadingLock.value = false
}


onMounted(() => {
  setTimeout(() => {
    fetchPictureData()
  }, 100)
  fetchCategoryAndTags()
  window.addEventListener('scroll', handlescrolldebound)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handlescrolldebound)
})

/**
 * 获取标签
 */
const fetchCategoryAndTags = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.code === 0) {
    categoryTagList.value = res.data
  }
}

/**
 * 检查界面高度是否小于屏幕高度
 */
const checkPageHeight = () => {
  setTimeout(() => {
    const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
    const clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight)

    if (scrollHeight <= clientHeight && !loadingFinish.value) {
      searchParams.current++
      searchParams.category = undefined
      searchParams.tags = []
      fetchPictureData()
    }
  }, 300)
}


/**
 * 滚动加载数据
 */
const handleScroll = () => {
  if (loadingFinish.value || loading.value) return
  const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight)
  if (scrollHeight - (clientHeight + scrollTop) < 500) {
    searchParams.current++
    searchParams.category = undefined
    searchParams.tags = []
    fetchPictureData()
  }
}

/**
 * 防抖
 * @param fn
 * @param delay
 */
const dobounce = (fn, delay) => {
  let timer = null
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

const handlescrolldebound = dobounce(handleScroll, 200)


</script>


<style scoped>
#home {
}

.search-bar {
  min-width: 480px;
  margin: 0 auto 16px;
  padding-top: 16px;
}

.scrollTop {
  margin-bottom: 43px;
  margin-right: 38px;
  opacity: 0.5;
}

.header{
  margin-bottom: 16px;
  background-image: url("../assets/homeimg.jpg");
  background-size: 100% 175px;
  width: 100%;
  height: 175px;
}
.btn-back{
  background-color: #b4cbf4;
  color: white;
  border: none;
}

:deep(.ant-tabs .ant-tabs-tab) {
  width: 84px;
  height: 36px;
  margin-left: 15px;
  background-color: #f5f7fa;
  border-radius: 15px !important;
  justify-content: center;
}

:deep(.ant-tabs .ant-tabs-tab-active) {
  background-color: #b4cbf4;
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
  border-bottom-color: #b4cbf4;
}

:deep(.ant-tag-checkable-checked) {
  background-color: #99add2;
  border-radius: 6px;
}
</style>

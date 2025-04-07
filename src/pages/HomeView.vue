<template>
  <div id='home'>
    <!--    搜索信息-->
    <div class='search-bar'>
      <a-input-search
        v-model:value='searchParams.searchText'
        placeholder='从海量图库中搜索'
        enter-button
        size='large'
        @search='doSearch'
      />
    </div>
    <a-tabs v-model:activeKey='selectCategory' @change='doSearch'>
      <a-tab-pane key='all' tab='全部' />
      <a-tab-pane v-for='cat in categoryTagList?.categoryList' :key='cat' :tab='cat' />
    </a-tabs>

    <span style='margin-right: 8px'>标签:</span>
    <a-space :size='[0, 8]' wrap>
      <a-checkable-tag
        v-for='(tag, index) in categoryTagList?.tagList'
        :key='tag'
        v-model:checked='selectTagsList[index]'
        @change='doSearch'
      >
        {{ tag }}
      </a-checkable-tag>
    </a-space>
    <div style='margin-bottom: 16px;'></div>
    <!-- 图片列表 -->
    <div v-if='loading'>
      <a-spin size='large' tip='加载中...' />
    </div>
    <div v-else>
      <WaterfallList :loading='loading' :dataList='dataList' :showOptions='false' />
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

  getListPictureByVoUsingPost,
  listPictureTagCategoryUsingGet
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { RocketTwoTone } from '@ant-design/icons-vue'
import WaterfallList from '../components/WaterfallList.vue'
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


const categoryTagList = ref<API.PictureTagCategory>()


const selectCategory = ref<string>('all')
const selectTagsList = ref<string[]>([])

/**
 * 搜索条件
 */
const searchParams = reactive<API.PictureQueryDto>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend'
})


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
  const res = await getListPictureByVoUsingPost(params)
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

  const res = await getListPictureByVoUsingPost({
    ...searchParams
  })
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
  max-width: 480px;
  margin: 0 auto 16px;
}

.scrollTop {
  margin-bottom: 43px;
  margin-right: 38px;
  opacity: 0.5;
}
</style>

<template>
  <a-form layout='inline' :model='searchParams'>
    <a-form-item label='关键词' name='searchText' style='margin-bottom: 16px; margin-right: 16px;'>
      <a-input v-model:value='searchParams.searchText' placeholder='请输入关键词...' />
    </a-form-item>
    <a-form-item label='分类' name='category'>
      <a-select
        v-model:value='searchParams.category'
        placeholder='请输入分类'
        style='min-width: 180px'
        allow-clear
      >
        <a-select-option v-for='cat in categoryTagList?.categoryList' :key='cat'>{{ cat }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item name='tags' label='标签'>
      <a-select
        v-model:value='searchParams.tags'
        mode='tags'
        placeholder='请输入标签'
        style='min-width: 180px'
        allow-clear
      >
        <a-select-option v-for='tag in categoryTagList?.tagList' :key='tag'>{{ tag }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label='简介' name='introduction'  v-if='isShowAll' style='margin-bottom: 16px; margin-right: 16px;'>
      <a-input v-model:value='searchParams.introduction' placeholder='请输入简介...' />
    </a-form-item>
    <a-form-item label='宽度' name='picWidth'  v-if='isShowAll'>
      <a-input-number v-model:value='searchParams.picWidth' style='min-width: 180px' placeholder='请输入图片宽度...' />
    </a-form-item>
    <a-form-item label='高度'  v-if='isShowAll'>
      <a-input-number v-model:value='searchParams.picHeight' style='min-width: 180px' placeholder='请输入图片高度...' />
    </a-form-item>
    <a-form-item label='格式' name='picFormat'  v-if='isShowAll' style='margin-bottom: 16px; margin-right: 16px;' >
      <a-input v-model:value='searchParams.picFormat' placeholder='请输入格式...' />
    </a-form-item>
    <a-form-item label='日期' name='data'  v-if='isShowAll'>
      <a-range-picker show-time v-model:value='dateRange' :presets='rangePresets' @change='onRangeChange'
                      format='YYYY/MM/DD HH:mm:ss' :placeholder='["开始时间","结束时间"]' />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type='primary' @click='doSearch'>搜索</a-button>
        <a-button html-type='reset' @click='doClear'>重置</a-button>
        <a-button @click='openCollapse'  v-if='!isShowAll'>高级搜索</a-button>
        <a-button @click='closeCollapse' v-if='isShowAll'>普通搜索</a-button>
      </a-space>

    </a-form-item>
  </a-form>
</template>

<script lang='ts' setup>

import { defineProps, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { listPictureTagCategoryUsingGet, searchPictureByColorUsingPost } from '../api/pictureController'

interface Props {
  searchParams: API.PictureQueryDto,
  doSearch: () => {}
}

const props = defineProps<Props>()
const searchParams = props.searchParams
const dateRange = ref<[]>([])
const categoryTagList = ref<API.PictureTagCategory>()

const isShowAll=ref<boolean>(false)

const openCollapse=()=>[
  isShowAll.value=true
]

const closeCollapse=()=>{
  isShowAll.value=false
}


/**
 * 获取标签数据
 */
const fetchCategoryAndTags = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.code === 0) {
    categoryTagList.value = res.data
  }
}

onMounted(() => {
  fetchCategoryAndTags()
})

/**
 * 日期范围更改时触发
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates.length < 2) {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  } else {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  }
}

const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] }
])

const doClear = () => {
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  dateRange.value = []
  props?.doSearch()
}


</script>

<style scoped>

</style>

<template>
  <div id='SpaceSizeAnalyzePage'>
    <a-card title='用户上传分析'>
      <template #extra>
        <a-space>
          <a-segmented v-model:value='timeDimension' :options='timeDimensionOptions' />
          <a-input-search placeholder='请输入用户id' enter-button='搜索用户' @search='doSearch'  />
        </a-space>
      </template>
      <v-chart :option='option' style='max-width: 100%; height: 400px;' :loading='loading'/>
    </a-card>

  </div>
</template>

<script setup lang='ts'>
import VChart from 'vue-echarts'
import 'echarts'
import { computed, defineProps, onMounted, ref, watchEffect } from 'vue'
import {
spaceUserAnalyzeUsingPost
} from '../../api/spaceAnalyzeController'
import { message } from 'ant-design-vue'

interface Props {
  queryPublic: boolean
  queryAll: boolean
  spaceId: number
}

const props = defineProps<Props>()
const loading=ref(false)

const dataList = ref<API.SpaceUserAnalyzeVo[]>([])
const userId = ref<string>()
const timeDimension = ref<string>('day')
const timeDimensionOptions = [
  {
    label: '日',
    value: 'day'
  },
  {
    label: '周',
    value: 'week'
  },
  {
    label: '月',
    value: 'month'
  }
]

const doSearch = (value) => {
  userId.value = value
}


//获取空间的使用情况
const getSpaceUserInfo = async () => {
  loading.value=true
  const res = await spaceUserAnalyzeUsingPost({
    spaceId: props.spaceId,
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    userId: userId.value as number,
    timeDimension: timeDimension.value
  })
  if (res.code === 0) {
    dataList.value = res.data ?? []
  } else {
    message.error('获取空间使用情况失败' + res.data)
  }
  loading.value=false
}

watchEffect(()=>{
  getSpaceUserInfo();
})


const option = computed(() => {
  const periods = dataList.value.map((item) => item.period) // 时间区间
  const counts = dataList.value.map((item) => item.count) // 上传数量

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: periods, name: '时间区间' },
    yAxis: { type: 'value', name: '上传数量' },
    series: [
      {
        name: '上传数量',
        type: 'line',
        data: counts,
        smooth: true, // 平滑折线
        emphasis: {
          focus: 'series'
        }
      }
    ]
  }
})


</script>


<style scoped>
#SpaceSizeAnalyzePage {
}

</style>

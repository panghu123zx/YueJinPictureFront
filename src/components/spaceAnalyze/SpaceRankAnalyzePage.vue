<template>
  <div id='SpaceRankAnalyzePage'>
    <a-card title='空间使用排行'>
      <v-chart :option='option' style='max-width: 100%; height: 400px;' />
    </a-card>

  </div>
</template>

<script setup lang='ts'>
import VChart from 'vue-echarts'
import 'echarts'
import { computed, defineProps, onMounted, ref } from 'vue'
import {
  spaceAnalyzeUsingPost,
} from '../../api/spaceAnalyzeController'
import { message } from 'ant-design-vue'

interface Props {
  topN: number
}

const props = defineProps<Props>()


const dataList = ref<API.Space[]>([])



//获取空间的使用情况
const getSpaceRankInfo = async () => {
  const res = await spaceAnalyzeUsingPost({
    topN: props.topN
  })
  if (res.code === 0) {
    dataList.value = res.data ?? []
  } else {
    message.error('获取空间使用情况失败' + res.data)
  }
}

onMounted(() => {
  getSpaceRankInfo()
})


const option = computed(() => {
  const spaceNames = dataList.value.map((item) => item.spaceName)
  const usageData = dataList.value.map((item) => (item.totalSize / (1024 * 1024)).toFixed(2)) // 转为 MB

  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: spaceNames,
    },
    yAxis: {
      type: 'value',
      name: '空间使用量 (MB)',
    },
    series: [
      {
        name: '空间使用量 (MB)',
        type: 'bar',
        data: usageData,
        itemStyle: {
          color: '#5470C6', // 自定义柱状图颜色
        },
      },
    ],
  }
})



</script>


<style scoped>
#SpaceRankAnalyzePage {
}

</style>

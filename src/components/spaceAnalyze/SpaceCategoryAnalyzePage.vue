<template>
  <div id='SpaceCategoryAnalyzePage'>
    <a-card title='图片分类占用'>
      <v-chart :option='option' style='max-width: 100%; height: 400px;' />
    </a-card>

  </div>
</template>

<script setup lang='ts'>
import VChart from 'vue-echarts'
import 'echarts'
import { computed, defineProps, onMounted, ref } from 'vue'
import { spaceCategoryAnalyzeUsingPost, spaceUsageAnalyzeUsingPost } from '../../api/spaceAnalyzeController'
import { message } from 'ant-design-vue'
import { formatSize } from '../../utils/index'

interface Props {
  queryPublic: boolean
  queryAll: boolean
  spaceId: number
}

const props = defineProps<Props>()

const spaceCategoryData = ref<API.SpaceCategoryAnalyzeVo[]>([])

//获取空间的使用情况
const getSpaceCategoryInfo = async () => {
  const res = await spaceCategoryAnalyzeUsingPost({
    spaceId: props.spaceId,
    queryAll: props.queryAll,
    queryPublic: props.queryPublic
  })
  if (res.code === 0) {
    spaceCategoryData.value = res.data
  } else {
    message.error('获取空间使用情况失败' + res.data)
  }
}

onMounted(() => {
  getSpaceCategoryInfo()
})

const option = computed(() => {
  const categories = spaceCategoryData.value.map((item) => item.category)
  const countData = spaceCategoryData.value.map((item) => item.count)
  const sizeData = spaceCategoryData.value.map((item) => (item.totalSize / (1024 * 1024)).toFixed(2)) // 转为 MB

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['图片数量', '图片总大小'], top: 'bottom' },
    xAxis: { type: 'category', data: categories },
    yAxis: [
      {
        type: 'value',
        name: '图片数量',
        axisLine: { show: true, lineStyle: { color: '#5470C6' } }, // 左轴颜色
      },
      {
        type: 'value',
        name: '图片总大小 (MB)',
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#91CC75' } }, // 右轴颜色
        splitLine: {
          lineStyle: {
            color: '#91CC75', // 调整网格线颜色
            type: 'dashed', // 线条样式：可选 'solid', 'dashed', 'dotted'
          },
        },
      },
    ],
    series: [
      { name: '图片数量', type: 'bar', data: countData, yAxisIndex: 0 },
      { name: '图片总大小', type: 'bar', data: sizeData, yAxisIndex: 1 },
    ],
  }
})

</script>


<style scoped>
#SpaceCategoryAnalyzePage {
}

</style>

<template>
  <div id='SpaceSizeAnalyzePage'>
    <a-card title='空间大小分析'>
      <v-chart :option='option' style='max-width: 100%; height: 400px;' />
    </a-card>

  </div>
</template>

<script setup lang='ts'>
import VChart from 'vue-echarts'
import 'echarts'
import { computed, defineProps, onMounted, ref } from 'vue'
import {
  spaceSizeAnalyzeUsingPost,
} from '../../api/spaceAnalyzeController'
import { message } from 'ant-design-vue'

interface Props {
  queryPublic: boolean
  queryAll: boolean
  spaceId: number
}

const props = defineProps<Props>()

const dataList = ref<API.SpaceSizeAnalyzeVo[]>([])

//获取空间的使用情况
const getSpaceSizeInfo = async () => {
  const res = await spaceSizeAnalyzeUsingPost({
    spaceId: props.spaceId,
    queryAll: props.queryAll,
    queryPublic: props.queryPublic
  })
  if (res.code === 0) {
    dataList.value = res.data ?? []
  } else {
    message.error('获取空间使用情况失败' + res.data)
  }
}

onMounted(() => {
  getSpaceSizeInfo()
})

const option = computed(() => {
  const pieData = dataList.value.map((item) => ({
    name: item.sizeRange,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      top: 'bottom',
    },
    series: [
      {
        name: '图片大小',
        type: 'pie',
        radius: '50%',
        data: pieData,
      },
    ],
  }
})


</script>


<style scoped>
#SpaceSizeAnalyzePage {
}

</style>

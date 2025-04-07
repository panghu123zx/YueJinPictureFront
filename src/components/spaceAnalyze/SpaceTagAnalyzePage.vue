<template>
  <div id='SpaceTagAnalyzePage'>
    <a-card title='图片标签分类占用'>
      <v-chart :option='option' style='max-width: 100%; height: 400px;' />
    </a-card>

  </div>
</template>

<script setup lang='ts'>
import VChart from 'vue-echarts'
import 'echarts'
import 'echarts-wordcloud'
import { computed, defineProps, onMounted, ref } from 'vue'
import {
  spaceTagAnalyzeUsingPost,
} from '../../api/spaceAnalyzeController'
import { message } from 'ant-design-vue'


interface Props {
  queryPublic: boolean
  queryAll: boolean
  spaceId: number
}

const props = defineProps<Props>()

const data = ref<API.SpaceTagAnalyzeVo[]>([])

//获取空间的使用情况
const getSpaceTagInfo = async () => {
  const res = await spaceTagAnalyzeUsingPost({
    spaceId: props.spaceId,
    queryAll: props.queryAll,
    queryPublic: props.queryPublic
  })
  if (res.code === 0) {
    data.value = res.data ?? []
  } else {
    message.error('获取标签使用情况失败' + res.data)
  }
}

onMounted(() => {
  getSpaceTagInfo()
})
const option = computed(() => {
  const tagData = data.value.map((item) => ({
    name: item.tag,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.value} 次`,
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 10,
        sizeRange: [12, 50], // 字体大小范围
        rotationRange: [-90, 90],
        shape: 'circle',
        textStyle: {
          color: () =>
            `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255,
            )}, ${Math.round(Math.random() * 255)})`, // 随机颜色
        },
        data: tagData,
      },
    ],
  }
})


</script>


<style scoped>
#SpaceTagAnalyzePage {
}

</style>

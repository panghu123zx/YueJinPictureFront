<template>
  <div id='SpaceAnalyzePage'>
    <a-flex gap='middle'>
      <a-card title='存储空间' style='width: 50%;height: 400px'>
        <div style='text-align: center;'>
          <h3> {{ formatSize(spaceUsageData?.usedSize) }} /
            {{ spaceUsageData?.maxSize ? formatSize(spaceUsageData?.maxSize) : '无限制' }}
          </h3>
          <a-progress type='dashboard' :percent='spaceUsageData?.sizeUsageRatio *100 ?? 0' />
        </div>
      </a-card>
      <a-card title='图片数量' style='width: 50%;height: 400px'>
        <div style='text-align: center;'>
          <h3>{{ spaceUsageData?.usedCount }} / {{ spaceUsageData?.maxCount ? spaceUsageData?.maxCount : '无限制' }}</h3>
          <a-progress type='dashboard' :percent='spaceUsageData?.countUsageRatio *100 ?? 0' />
        </div>
      </a-card>
    </a-flex>

  </div>
</template>

<script setup lang='ts'>

import { defineProps, onMounted, ref } from 'vue'
import { spaceUsageAnalyzeUsingPost } from '../../api/spaceAnalyzeController'
import { message } from 'ant-design-vue'
import { formatSize } from '../../utils/index'

interface Props {
  queryPublic: boolean
  queryAll: boolean
  spaceId: number
}

const props = defineProps<Props>()

const spaceUsageData = ref<API.SpaceUsageAnalyzeVo>({})

//获取空间的使用情况
const getSpaceUsageInfo = async () => {
  const res = await spaceUsageAnalyzeUsingPost({
    spaceId: props.spaceId,
    queryAll: props.queryAll,
    queryPublic: props.queryPublic
  })
  if (res.code === 0) {
    spaceUsageData.value = res.data
  } else {
    message.error('获取空间使用情况失败' + res.data)
  }
}

onMounted(() => {
  getSpaceUsageInfo()
})

</script>


<style scoped>
#SpaceAnalyzePage {
}

</style>

<template>
  <a-modal v-model:open='visible' title='AI扩图' :footer='false' @cancel='closeModal'>
    <a-row :gutter='[16,16]'>
      <a-col :span='12'>
        <h4>原始图片</h4>
        <a-image :src='picture?.url' style='max-width: 100%;'/>
      </a-col>
      <a-col :span='12'>
        <h4>扩图结果</h4>
        <a-image v-if='resultImage' :src='resultImage' :loading='loading' style='max-width: 100%;'/>
      </a-col>
    </a-row>
    <div style='margin-bottom: 16px;' />
    <a-flex gap='16' justify='center'>
      <a-button type='primary' ghost @click='generatePicture' :loading='loading'>生成图片</a-button>
      <a-button v-if='resultImage' type='primary' @click='handleUpload' :loading='uploadLoading'>应用结果</a-button>
    </a-flex>
  </a-modal>
</template>

<script lang='ts' setup>
import { defineExpose, defineProps, onUnmounted, ref } from 'vue'
import {
  createOutPaintingTaskUsingPost,
  getOutPaintingTaskUsingGet, uploadPictureByUrlUsingPost,
  uploadPictureUsingPost
} from '../api/pictureController'
import { message } from 'ant-design-vue'


interface Props {
  picture: API.Picture
  spaceId: number
  onSuccess?: (newPicture: API.Picture) => void
}


const props = defineProps<Props>()
const loading = ref(false)
const visible = ref(false)
const resultImage = ref<String>('')
const taskId = ref<String>('')
const uploadLoading = ref(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

const generatePicture = async () => {
  loading.value = true
  if (!props.picture?.id) {
    return
  }
  const res = await createOutPaintingTaskUsingPost({
    pictureId: props.picture.id,
    parameters: {
      xScale: 2,
      yScale: 2
    }
  })
  if (res.code === 0) {
    message.success('生成图片中，请不要退出...')
    taskId.value = res.data?.output?.taskId
    //开启轮询
    startPolling()
  } else {
    message.error('生成图片失败')
  }
  loading.value = false
}
//定义定时器
let pollingTimer: NodeJS.Timeout = null

//清理轮询定时器
const clearPolling = () => {
  if (pollingTimer) {
    //清除定时器
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = null
  }
}

const startPolling = () => {
  if (!taskId.value) {
    return
  }
  //使用定时器开启轮询
  pollingTimer = setInterval(async () => {
    try {
      const res = await getOutPaintingTaskUsingGet({
        taskId: taskId.value
      })
      if (res.code === 0) {
        const output = res.data?.output
        if (output.taskStatus === 'SUCCEEDED') {
          resultImage.value = output?.outputImageUrl
          clearPolling()
        } else if (res.data?.status === 'FAILED') {
          message.error('扩图任务失败')
          clearPolling()
        }
      }
    } catch (e) {
      console.error('轮询任务失败')
      message.error('检测任务失败，请稍后重试...')
      clearPolling()
    }
  }, 3000) //每隔3s 轮询一次
}



//上传函数
const handleUpload = async () => {
  uploadLoading.value = true
  try {
    const params : API.PictureUploadDto = props.picture ? {
      id: props.picture.id,
      fileUrl: resultImage.value,
    } : { fileUrl: resultImage.value }
    params.spaceId=props.spaceId
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.code === 0) {
      props.onSuccess?.(res.data)
      message.success('上传图片成功')
      closeModal()
    } else {
      message.error('上传图片失败')
    }
  } catch (e) {
    message.error('上传图片失败:{}', e.message)
  } finally {
    uploadLoading.value = false
  }
}

defineExpose({
  openModal
})


onUnmounted(() => {
  clearPolling()
})
</script>

<style scoped>

</style>

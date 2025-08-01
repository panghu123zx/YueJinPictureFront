<template>
  <a-modal v-model:open='visible' title='AI生图' :footer='false' @cancel='closeModal'>
    <a-row>
      <a-col :span='6'>
        <a-form
          :model='aiPicture'
          name='basic'
          layout='vertical'
          autocomplete='off'
          @finish='onFinish'
          @finishFailed='onFinishFailed'
        >
          <a-form-item
            label='图片名称'
            name='name'
            :rules="[{ required: true, message: '请输入你的图片名称...' }]"
          >
            <a-input v-model:value='aiPicture.name' placeholder='请输入你的图片名称...' />
          </a-form-item>

          <a-form-item
            label='内容'
            name='content'
            :rules="[{ required: true, message: '请输入你要生成的图片内容...' }]"
          >
            <a-textarea :autosize='{ minRows: 2, maxRows: 6 }' v-model:value='aiPicture.content'
                        placeholder='请输入你要生成的图片内容...' />
          </a-form-item>
          <a-form-item :wrapper-col='{ offset: 8, span: 16 }'>
            <a-button type='primary' html-type='submit' :disabled='loading' @click='doSubmit'>生成</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span='18'>
        <a-image v-if='pictureUrl!=="null"' :src='pictureUrl' style='max-width: 550px;max-height: 490px;margin-left: 35px;'/>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script lang='ts' setup>
import { defineExpose, defineProps, onUnmounted, ref, watchEffect } from 'vue'
import {
  createOutPaintingTaskUsingPost,
  getOutPaintingTaskUsingGet, getPictureByIdVoUsingGet, uploadAiPictureUsingPost, uploadPictureByUrlUsingPost,
  uploadPictureUsingPost
} from '../api/pictureController'
import { message } from 'ant-design-vue'


const loading = ref(false)
const visible = ref(false)
const aiPicture = ref<API.PictureAiDto>({
  name: '',
  content: ''
})
const pictureId = ref()
const pictureUrl = ref()

//生成ai图片
const doSubmit = async () => {
  loading.value = true
  const res = await uploadAiPictureUsingPost({
    ...aiPicture.value
  })
  if (res.code == 0 && res.data) {
    message.success('生成图片中，请不要退出...')
    pictureUrl.value = res.data.url
    pictureId.value = res.data.id
    //开启轮询
    startPolling()
  } else {
    message.error('生成图片失败'+res.data)
  }
}

//定义定时器
let pollingTimer: NodeJS.Timeout = null

//清理轮询定时器
const clearPolling = () => {
  if (pollingTimer) {
    //清除定时器
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

const startPolling = () => {
  if (pictureUrl.value!=='null') {
    return
  }
  //使用定时器开启轮询
  pollingTimer = setInterval(async () => {
    try {
      const res = await getPictureByIdVoUsingGet({
        id: pictureId.value
      })
      if (res.code === 0 &&res.data) {

        if(res.data.url!=='null'){
          pictureUrl.value =res.data.url
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

// watchEffect(()=>{
//   pictureUrl.value
// })

onUnmounted(() => {
  clearPolling()
})


const openModal = () => {
  visible.value = true
}
const closeModal = () => {
  visible.value = false
  loading.value=false
}
defineExpose({
  openModal
})

</script>

<style scoped>
:deep(:where(.css-dev-only-do-not-override-1p3hq3p).ant-modal .ant-modal-content) {
  width: 800px;
  height: 560px;
}

</style>

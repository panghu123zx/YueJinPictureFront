<template>
  <div id='AddPicture'>
    <h2> 批量创建图片</h2>
    <div style='margin-bottom: 16px;'></div>
    <a-form
      :model='formData'
      name='basic'
      layout='vertical'
      autocomplete='off'
      @finish='onFinish'
      @finishFailed='onFinishFailed'
    >
      <a-form-item
        label='关键词'
        name='searchText'
        :rules="[{ require:true ,message: '必须指定关键词' }]"
      >
        <a-input v-model:value='formData.searchText' placeholder='请输入关键词' />
      </a-form-item>

      <a-form-item
        label='获取图片数量'
        name='count'
      >
        <a-input-number v-model:value='formData.count' :min='1' :max='30' style='min-width: 100%;' />
      </a-form-item>

      <a-form-item
        label='名称前缀'
        name='namePrefix'
      >
        <a-input v-model:value='formData.namePrefix' placeholder='请输入名称前缀，会自动填充序号' />
      </a-form-item>


      <a-form-item>
        <a-button type='primary' html-type='submit' style='min-width: 100%;' :loading='loading' @click='doUploadPictureBatch'>执行任务
        </a-button>
      </a-form-item>
    </a-form>
  </div>

</template>
<script lang='ts' setup>
import PictureUpload from '../components/PictureUpload.vue'
import { onMounted, ref } from 'vue'
import PictureEditDto = API.PictureEditDto
import {
  editPictureUsingPost,
  getPictureByIdVoUsingGet,
  listPictureTagCategoryUsingGet, uploadPictureByBatchUsingPost
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import UrlUpload from '../components/UrlUpload.vue'


const formData = ref<API.PictureUploadByBatchDto>({
  count: 10
})


const router = useRouter()
const loading = ref<boolean>(false)

//抓取图片
const doUploadPictureBatch = async () => {
  loading.value = true
  const res = await uploadPictureByBatchUsingPost({
    ...formData.value
  })
  if (res.code === 0) {
    message.success('图片抓取成功')
    router.push({
      path: '/'
    })
  } else {
    message.error('图片抓取失败')
  }
  loading.value=false
}


</script>

<style scoped>
#AddPicture {
  max-width: 720px;
  margin: 0 auto;
}
</style>

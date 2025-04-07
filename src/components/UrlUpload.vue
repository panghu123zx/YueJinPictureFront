<template>
  <div class='url-picture-upload'>
    <a-input-group compact style='margin-bottom: 16px'>
      <a-input v-model:value='fileUrl' style='width: calc(100% - 120px) ;max-width: 500px' placeholder='请输入图片 URL' />
      <a-button type='primary' :loading='loading' @click='handleUpload' style='width: 120px'>提交</a-button>
    </a-input-group>
    <img v-if='picture?.url' :src='picture?.url' alt='avatar' style='margin-left: 20%;' />
  </div>

</template>
<script lang='ts' setup>
import { defineProps, ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost, uploadPictureUsingPost } from '../api/pictureController'

//定义属性
interface Props {
  picture: '',
  spaceId: number
  onSuccess: (newPicture: API.PictureVO) => void;
}

const props = defineProps<Props>()


const loading = ref<boolean>(false)

const fileUrl = ref<string>()


//上传函数
const handleUpload = async () => {
  loading.value = true
  try {
    const params : API.PictureUploadDto = props.picture ? {
      id: props.picture.id,
      fileUrl: fileUrl.value,
    } : { fileUrl: fileUrl.value }
    params.spaceId=props.spaceId
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.code === 0) {
      props.onSuccess?.(res.data)
      message.success('上传图片成功')
    } else {
      message.error('上传图片失败')
    }
  } catch (e) {
    message.error('上传图片失败:{}', e.message)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
</style>

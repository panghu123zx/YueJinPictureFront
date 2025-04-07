<template>
  <div id='PictureUpload'>
    <a-upload
      list-type='picture-card'
      :show-upload-list='false'
      :before-upload='beforeUpload'
      :custom-request='handleUpload'
    >
      <img v-if='picture?.url' :src='picture?.url' alt='avatar' style='max-height: 280px' />
      <div v-else>
        <loading-outlined v-if='loading'></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class='ant-upload-text'>点击拖拽上传图片</div>
      </div>
    </a-upload>

  </div>
</template>
<script lang='ts' setup>
import { defineProps, ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { uploadPictureUsingPost } from '../api/pictureController'

import { PICTURE_EDIT_ACTION_ENUM } from '../constants/picture'

//定义属性
interface Props {
  picture?: API.PictureVO,
  spaceId?: number,
  onSuccess?: (newPicture: API.PictureVO) => void;
}

const props = defineProps<Props>()


const loading = ref<boolean>(false)

//上传函数
const handleUpload = async ({ file }: any) => {
   loading.value = true
   try {
     const params: API.PictureUploadDto = props.picture ? {
       id: props.picture.id
     } : {}

     params.spaceId = props.spaceId
     const res = await uploadPictureUsingPost(params, {}, file)
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
//上传前的校验
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持上传图片的格式！仅支持jpg 或 png')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('不能上传超过2M的图片')
  }
  return isJpgOrPng && isLt2M
}
</script>


<style scoped>
#PictureUpload :deep(.ant-upload) {
  width: 100%;
  height: 100%;
  min-width: 152px;
  min-height: 400px;
}

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

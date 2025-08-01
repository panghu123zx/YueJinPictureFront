<template>
  <div class='editUserPwd'>
    <a-modal v-model:open='visible' title='编辑资料' :footer='false' @cancel='closeModal'>
      <a-form layout='vertical' :model='editUser'>
        <a-form-item label='用户名'>
          <a-input v-model:value='editUser.userName' placeholder='请输入用户名...' />
        </a-form-item>
        <a-form-item label='用户头像'>
          <a-upload
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
          >
            <a-flex justify='space-between' align='center'>
              <img :src="editUser.userAvatar" alt="avatar"  style='max-width: 150px'/>
              <div style='margin-left: 16px;'>
                <loading-outlined v-if="loading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <a-button class='ant-upload-text'>上传头像</a-button>
              </div>
            </a-flex>
          </a-upload>
        </a-form-item>
        <a-form-item label='用户简介'>
          <a-textarea v-model:value='editUser.userProfile' show-count :maxlength='100' placeholder='请输入用户简介...' />
        </a-form-item>
        <a-form-item>
          <a-button type='primary' @click='doSubmit'>提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

</template>

<script lang='ts' setup>
import { defineExpose, defineProps, onMounted, ref, withDefaults } from 'vue'
import {
  editPictureByBatchUsingPost,
  listPictureTagCategoryUsingGet,
  uploadPictureUsingPost
} from '../api/pictureController'
import { message, UploadProps } from 'ant-design-vue'
import { changePwdUsingPost, editUserUsingPost, uploadAvatarUsingPost } from '../api/userController'
import { useRouter } from 'vue-router'

interface Props {
  id: number,
  userName: string,
  userAvatar: string,
  userProfile: string,
  onSuccess: ()=>{}
}

const router = useRouter()


const props = defineProps<Props>()

const visible = ref(false)
const loading=ref(false)

const editUser = ref<API.UserEditDto>({
  id: props.id,
  userName: props.userName,
  userAvatar: props.userAvatar,
  userProfile: props.userProfile
})

const openModal = () => {
  visible.value = true
  editUser.value={
    id: props.id,
    userName: props.userName,
    userAvatar: props.userAvatar,
    userProfile: props.userProfile
  }
}

const closeModal = () => {
  visible.value = false
}

//提交编辑
const doSubmit = async () => {
  const res = await editUserUsingPost({
    ...editUser.value
  })
  //判断是否成功
  if (res.code === 0) {
    message.success('用户资料修改成功')
    closeModal()
    props?.onSuccess()
  } else {
    message.error('用户资料修改失败' + res.data)
  }
}

//上传函数
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const res = await uploadAvatarUsingPost({},file)
    if (res.code === 0 && res.data) {
      editUser.value.userAvatar = res.data
    } else {
      message.error('上传图片失败'+res.data)
    }
  } catch (e) {
    message.error('上传图片失败:{}', e.message)
  }finally {
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

//暴露函数
defineExpose({
  openModal
})
</script>

<style scoped>
.editUserPwd {
}
</style>

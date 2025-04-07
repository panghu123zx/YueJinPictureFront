<template>
  <div class='editUserPwd'>
    <a-modal v-model:open='visible' title='编辑资料' :footer='false' @cancel='closeModal'>
      <a-form layout='vertical' :model='editUser'>
        <a-form-item label='用户名'>
          <a-input v-model:value='editUser.userName' placeholder='请输入用户名...' />
        </a-form-item>
        <a-form-item label='用户头像'>
          <a-input v-model:value='editUser.userAvatar' placeholder='当前只支持传入链接...' />
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
import { editPictureByBatchUsingPost, listPictureTagCategoryUsingGet } from '../api/pictureController'
import { message } from 'ant-design-vue'
import { changePwdUsingPost, editUserUsingPost } from '../api/userController'
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
//暴露函数
defineExpose({
  openModal
})
</script>

<style scoped>
.editUserPwd {
}
</style>

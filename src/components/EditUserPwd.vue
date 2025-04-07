<template>
  <div class='editUserPwd'>
    <a-modal v-model:open='visible' title='修改密码' :footer='false' @cancel='closeModal'>
      <a-form layout='vertical' :model='editUser'>
        <a-form-item label='旧密码'>
          <a-input v-model:value='editUser.oldUserPassword' placeholder='请输入旧密码...' />
        </a-form-item>
        <a-form-item label='新密码'>
          <a-input-password v-model:value='editUser.userPassword' placeholder='请输入新密码...' />
        </a-form-item>
        <a-form-item label='确认密码'>
          <a-input v-model:value='editUser.checkPassword' placeholder='请确认密码...' />
        </a-form-item>
        <a-form-item>
          <a-button type='primary' @click='doSubmit'>提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang='ts' setup>
import { defineExpose, defineProps, onMounted, ref } from 'vue'
import { editPictureByBatchUsingPost, listPictureTagCategoryUsingGet } from '../api/pictureController'
import { message } from 'ant-design-vue'
import { changePwdUsingPost } from '../api/userController'
import { useRouter } from 'vue-router'

interface Props {
  id: number
}

const router=useRouter()

const props = defineProps<Props>()

const editUser = ref<API.UserChangePwdDto>({})
const visible = ref(false)

const openModal = () => {
  visible.value = true
  editUser.value.id=props.id
}

const closeModal = () => {
  visible.value = false
}

//提交编辑
const doSubmit = async () => {
  const res = await changePwdUsingPost({
    ...editUser.value
  })
  //判断是否成功
  if (res.code === 0) {
    message.success('密码修改成功')
    closeModal()
    window.location.reload()
  } else {
    message.error('密码修改失败'+ res.data)
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

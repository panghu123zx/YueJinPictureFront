<template>
  <div class='all-upload-page'>
    <a-modal v-model:open='visible' title='上传' :footer='false' @cancel='closeModal' style='width: 600px'>
      <a-card hoverable @click='toUpload("/addpicture")' >
        <a-card-meta title='上传-公共图库'  description='你上传的图片在审核之后展示给所有用户' style='align-items: center'>
          <template #avatar>
            <PictureOutlined style='font-size: 30px'/>
          </template>
        </a-card-meta>
      </a-card>
      <a-card hoverable style='margin-top: 16px;'  @click='toUpload(`/addpicture?spaceId=${space?.id}`)'>
        <a-card-meta title='上传-私人空间' description='你上传的图片仅有你可见' style='align-items: center'>
          <template #avatar>
            <UserOutlined  style='font-size: 30px'/>
          </template>
        </a-card-meta>
      </a-card>
      <a-card hoverable  style='margin-top: 16px;'  @click='toUpload("/addforum")'>
        <a-card-meta title='上传-帖子' description='分享你的图片和想法' style='align-items: center'>
          <template #avatar>
            <FileAddOutlined  style='font-size: 30px'/>
          </template>
        </a-card-meta>
      </a-card>
    </a-modal>
  </div>
</template>

<script lang='ts' setup>
import { defineExpose, defineProps, onMounted, ref } from 'vue'
import { FileAddOutlined,PictureOutlined,UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { getListSpaceByVoUsingPost } from '../api/spaceController'
import { useLoginuserStore } from '../stores/loginuserStore'

const router = useRouter()
const loginUserStore = useLoginuserStore()
const visible = ref(false)
const space=ref<API.SpaceVO>()

const toUpload=(key)=>{
  router.push(key)
  closeModal()
}

//进入个人空间界面的权限校验
const checkUserSpace = async () => {
  //判断用户是否登入
  if (loginUserStore.loginUser?.id === null) {
    router.push(`/user/login`)
    return
  }
  //找到当前登入用户的个人空间
  const res = await getListSpaceByVoUsingPost({
    userId: loginUserStore.loginUser?.id,
    current: 1,
    pageSize: 1
  })
  if (res.code == 0) {
    //当前用户没有创建个人空间，跳转到新建个人空间
    if (res.data.records.length === 0) {
      message.warn('请先创建个人空间')
      router.push('/addspace')
    } else {
      //创建了就取第一个
      space.value = res.data.records[0]
    }
  } else {
    message.error('获取个人空间信息失败：' + res.data)
  }
}

const openModal = () => {
  visible.value = true
  checkUserSpace()
}

const closeModal = () => {
  visible.value = false
}

//暴露函数
defineExpose({
  openModal
})
</script>

<style scoped>
.all-upload-page {
  height: 400px;
}
</style>

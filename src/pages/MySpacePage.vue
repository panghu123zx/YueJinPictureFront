<template>
  <div id='mySpace'>
    <div>正在跳转中...</div>
  </div>
</template>

<script setup lang='ts'>
import { useLoginuserStore } from '../stores/loginuserStore'
import { useRouter } from 'vue-router'
import { getListSpaceByVoUsingPost } from '../api/spaceController'
import { onMounted} from 'vue'
import { message } from 'ant-design-vue'



const router = useRouter()
const loginUserStore = useLoginuserStore()


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
      const space = res.data.records[0]
      router.replace(`/space/${space.id}`)
    }
  } else {
    message.error('获取个人空间信息失败：' + res.data)
  }
}


onMounted(() => {
  checkUserSpace()
})


</script>


<style scoped>
#mySpace {
}

.search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}
</style>

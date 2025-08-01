<template>
  <a-row :gutter='[16,16]'>
    <a-col :span='15'>
      <a-card>
        <a-space>
          <a-avatar :size='100' :src='user?.userAvatar ' />
          <a-typography>
            <a-typography-paragraph style='margin-bottom: 1px;'>{{ user?.userName }}</a-typography-paragraph>
            <a-typography-paragraph style='margin-bottom: 1px; '>账号：{{ user?.userAccount }}</a-typography-paragraph>
            <a-typography-paragraph style='margin-bottom: 1px;color: #7c6b6b'>简介: {{ user?.userProfile }}
              <a-typography-paragraph style='margin-bottom: 1px;color: #7c6b6b'>
                <a-space>
                  <span @click='getMyFollow'>{{followerCount}} 关注</span>
                  <span @click='getFollowMy'>{{fansCount}} 粉丝</span>
                </a-space>
              </a-typography-paragraph>
            </a-typography-paragraph>
          </a-typography>
        </a-space>
      </a-card>
      <a-card title='空间使用分析' style='margin-top: 16px;'>
        <SpaceUserAnalyzePage v-if='space' :spaceId='space?.id' :queryAll='false' :queryPublic='false' />
        <div v-else>
          <a-spin />
        </div>
      </a-card>
    </a-col>
    <a-col :span='9'>
      <a-card>
        <a-collapse expandIconPosition='end'>
          <a-collapse-panel header='编辑资料' @click='changeUserInfo' />
          <a-collapse-panel header='修改密码' @click='changeUserPwd' />
          <a-collapse-panel header='我的点赞' @click='router.push("/likesharepic")' />
          <a-collapse-panel header='关于图库' @click='toMyGithub' />
          <a-collapse-panel header='退出登入' @click='doLogout' />
        </a-collapse>
      </a-card>
      <a-card style='text-align: center; margin-top: 16px;background-color: #f1f1f1'>
        <img src='../assets/火影.jpg' style='max-height: 350px'>
      </a-card>
    </a-col>
  </a-row>
  <EditUserPwd ref='editUserPwd' :id='user?.id' />
  <EditUserInfo ref='editUserInfo' :id='user?.id' :userName='user?.userName' :userAvatar='user?.userAvatar'
                :userProfile='user?.userProfile' :onSuccess='fetchData' />
  <FollowPage ref='followPage' :id='user?.id' :follow='follow'/>
</template>

<script lang='ts' setup>
import { useLoginuserStore } from '../stores/loginuserStore'
import { nextTick, onMounted, ref } from 'vue'
import { getLoginUserUsingGet, userLogoutUsingGet } from '../api/userController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import EditUserPwd from '../components/EditUserPwd.vue'
import EditUserInfo from '../components/EditUserInfo.vue'
import FollowPage from '../components/FollowPage.vue'
import dayjs from 'dayjs'
import { getFollowCountUsingGet } from '../api/followController'
import { getListSpaceByVoUsingPost } from '../api/spaceController'
import SpaceUserAnalyzePage from '../components/spaceAnalyze/SpaceUserAnalyzePage.vue'


const router = useRouter()
const editUserPwd = ref()
const editUserInfo = ref()
const followPage = ref()
const loginUserStore = useLoginuserStore()
const user = ref<API.UserVO>()
const space=ref<API.SpaceVO>()
//粉丝数
const fansCount = ref()
//关注数
const followerCount = ref()


/**
 * 获取个人信息
 */
const fetchData = async () => {
  const res = await getLoginUserUsingGet()
  if (res.code === 0 && res.data) {
    user.value = res.data
  } else {
    message.error('获取个人信息失败' + res.data)
  }
}

/**
 * 获取关注数和粉丝数
 */
const fetchFollowCount = async () => {
  const res = await getFollowCountUsingGet()
  if (res.code === 0 && res.data) {
    fansCount.value = res.data.followerId
    followerCount.value = res.data.userId
  }else{
    message.error('获取关注信息失败' )
  }
}

//进入个人空间界面的权限校验
const checkUserSpace = async () => {
  //找到当前登入用户的个人空间
  const res = await getListSpaceByVoUsingPost({
    userId: loginUserStore.loginUser?.id,
    current: 1,
    pageSize: 1
  })
  if (res.code == 0) {
    //当前用户没有创建个人空间，跳转到新建个人空间
    if (res.data.records.length === 0) {
      message.warn("创建个人空间才能查看信息")
    } else {
      //创建了就取第一个
      space.value = res.data.records[0]
    }
  } else {
    message.error('获取个人空间信息失败：' + res.data)
  }
}


/**
 * 退出登入
 */
const doLogout = async () => {
  const res = await userLogoutUsingGet()
  if (res.code === 0) {
    message.success('退出成功')
    //去除登入态
    loginUserStore.setLoginUser({})
    router.push('/user/login')
  } else {
    message.error('退出登入失败')
  }
}

onMounted(() => {
  fetchData()
  fetchFollowCount()
  checkUserSpace()
})
//修改密码
const changeUserPwd = () => {
  if (editUserPwd.value) {
    editUserPwd.value.openModal()
  }
}

//编辑信息
const changeUserInfo = () => {
  if (editUserInfo.value) {
    editUserInfo.value.openModal()
  }
}

//关于自己
const toMyGithub = () => {
  window.open('https://github.com/panghu123zx')
}

//查询我关注的人
//0-查询我关注的   1-查询关注我的
const follow=ref(0)
const getMyFollow = () => {
  follow.value=0
  nextTick(()=>{
    if (followPage.value) {
      followPage.value.openModal()
      followPage.value.fetchFollow()
    }
  })
}

//查询关注我的人
const getFollowMy=()=>{
  follow.value=1
  nextTick(()=>{
    if (followPage.value) {
      followPage.value.openModal()
      followPage.value.fetchFollow()
    }
  })

}
</script>

<style scoped>
:deep(.ant-collapse-content-active) {
  max-height: 1px;
}
</style>

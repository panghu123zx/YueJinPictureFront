<template>
  <a-row :gutter='[16,16]'>
    <a-col :span='15'>
      <a-card >
        <a-space>
          <a-avatar :size='100' :src='user?.userAvatar ' />
          <a-typography>
            <a-typography-paragraph style='margin-bottom: 1px;'>用户名: {{ user?.userName }}</a-typography-paragraph>
            <a-typography-paragraph style='margin-bottom: 1px; '>账号: {{ user?.userAccount }}</a-typography-paragraph>
            <a-typography-paragraph style='margin-bottom: 1px;color: #7c6b6b'>Id: {{ user?.id }}
            </a-typography-paragraph>
            <a-typography-paragraph style='margin-bottom: 1px;color: #7c6b6b'>简介: {{ user?.userProfile }}
            </a-typography-paragraph>
          </a-typography>
        </a-space>
      </a-card>

      <a-card title='我发布的评论' style='margin-top: 16px;'>
        <a-list
          :data-source="commentList"
          :pagination='pagination'
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-comment :author="item.userName ?? '无名'" :avatar="item.userAvatar ">
                <template #actions>
                  <a-space>
                    <LikeFilled />
                    {{ item.likeCount }}
                  </a-space>
                  <a-space style='margin-left: 16px;' @click='deleteComment(item)'>
                    <DeleteOutlined />
                    <span style='font-size: 11px;'>删除</span>
                  </a-space>
                </template>

                <template #content>
                  <p @click='router.push(`/picture/${item.targetId}`)'>
                    {{ item.content ?? '评论内容为空'}}
                  </p>
                </template>

                <template #datetime>
                  <a-tooltip>
                    <span>{{ dayjs(item.createTime).format('YYYY-MM-DD') }}</span>
                  </a-tooltip>
                </template>
              </a-comment>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </a-col>
    <a-col :span='9'>
      <a-card>
        <a-collapse expandIconPosition='end'>
          <a-collapse-panel header='编辑资料'  @click='changeUserInfo'/>
          <a-collapse-panel  header='修改密码' @click='changeUserPwd'/>
          <a-collapse-panel  header='评论我的评论历史' @click='getCommentMy'/>
          <a-collapse-panel  header='我喜欢的图片' @click='router.push("/likesharepic")'/>
          <a-collapse-panel  header='关于图库' @click='toMyGithub'/>
          <a-collapse-panel  header='退出登入' @click='doLogout'/>
        </a-collapse>
      </a-card>
      <a-card style='text-align: center; margin-top: 16px;background-color: #f1f1f1'>
        <img src='../assets/火影.jpg' style='max-height: 350px'>
      </a-card>
    </a-col>
  </a-row>

 <CommentMyHistory ref='commentMyHistory'/>
  <EditUserPwd ref='editUserPwd' :id='user?.id'/>
  <EditUserInfo ref='editUserInfo' :id='user?.id' :userName='user?.userName' :userAvatar='user?.userAvatar' :userProfile='user?.userProfile' :onSuccess='fetchData'/>
</template>

<script lang='ts' setup>
import { useLoginuserStore } from '../stores/loginuserStore'
import { onMounted, ref } from 'vue'
import { getLoginUserUsingGet, userLogoutUsingGet } from '../api/userController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import EditUserPwd from '../components/EditUserPwd.vue'
import EditUserInfo from '../components/EditUserInfo.vue'
import { deleteCommentUsingPost, getMyCommentHistoryUsingPost } from '../api/commentController'
import dayjs from 'dayjs'
import { LikeFilled,DeleteOutlined } from '@ant-design/icons-vue'
import CommentMyHistory from '../components/CommentMyHistory.vue'

const router=useRouter()
const editUserPwd=ref()
const editUserInfo=ref()

const loginUserStore = useLoginuserStore()

const commentList=ref<API.CommentVO[]>([])

const user = ref<API.UserVO>()
const commentMyHistory=ref()

//分页参数
const pagination = {
  onChange: (page: number) => {
  },
  pageSize: 3,
};

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
 * 获取我的评论
 */
const fetchMyComment=async ()=>{
  const res=await getMyCommentHistoryUsingPost({})
  if(res.code===0 && res.data){
    commentList.value=res.data.records ?? []
  }else{
    message.error('获取评论历史失败'+res.data)
  }
}


/**
 * 删除评论
 */
const deleteComment=async (item)=>{
  const res=await deleteCommentUsingPost({
    id: item.id
  })
  if(res.code===0){
    message.success('删除成功')
    fetchMyComment()
  }else{
    message.error('删除失败')
  }
}

/**
 * 获取评论我的历史
 */

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
  fetchMyComment()
})

const changeUserPwd=()=>{
  if(editUserPwd.value){
    editUserPwd.value.openModal()
  }
}

const changeUserInfo=()=>{
  if(editUserInfo.value){
    editUserInfo.value.openModal()
  }
}

const getCommentMy=()=>{
  if(commentMyHistory.value){
    commentMyHistory.value.openModal()
    commentMyHistory.value.fetchCommentMy()
  }
}

const toMyGithub=()=>{
  window.open("https://github.com/panghu123zx")
}
</script>

<style scoped>
:deep(.ant-collapse-content-active){
  max-height: 1px;
}
</style>

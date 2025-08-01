<template>
  <div id='message-page'>
    <a-flex justify='space-between'>
      <h2>
        消息中心
      </h2>
      <a-space>
        <a-button @click='doHistory'>消息历史</a-button>

        <a-button @click='myComment' v-if='backOrMyMessage'>我的互动</a-button>
        <a-button @click='doRead' v-else>返回</a-button>
      </a-space>
    </a-flex>
    <a-row>
      <a-col :span='8' >
        <a-button class='btn-sty' @click='getComMessage' :class='{"btn-color" : changTags===0}' >
          <CommentOutlined style='font-size: 50px' />
          {{ messageStr }}评论
        </a-button>
      </a-col>
      <a-col :span='8'>
        <a-button class='btn-sty' @click='getLikeMessage' :class='{"btn-color" : changTags===1}'>
          <LikeOutlined style='font-size: 50px' />
          {{ messageStr }}点赞
        </a-button>
      </a-col>
      <a-col :span='8'>
        <a-button class='btn-sty' @click='getShareMessage' :class='{"btn-color" : changTags===2}'>
          <ShareAltOutlined style='font-size: 50px' />
          {{ messageStr }}分享
        </a-button>
      </a-col>
    </a-row>
    <a-card :title='total + "条"+messageStr +"消息" '>
      <template #extra>
        <a-space>
          <a-button size='small' @click='changePic' :class='{"btn-color" : picOrFor===0}' >
            <PictureOutlined />
            图片
          </a-button>
          <a-button size='small' @click='changeFor' :class='{"btn-color" : picOrFor===1}'>
            <FileImageOutlined />
            帖子
          </a-button>
        </a-space>
      </template>
      <a-list item-layout='horizontal' :data-source='changTags===0 ? comList : likeList'>
        <template #renderItem='{ item }'>
          <a-list-item style='background-color: #f3f3f3;margin-bottom: 10px;'>
            <a-list-item-meta
              :description="dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') "
            >
              <template #title>
                <a>{{ item.userVO?.userName }}</a>
              </template>
              <template #avatar>
                <a-avatar :src='item.userVO?.userAvatar' />
              </template>
            </a-list-item-meta>
            {{ changTags === 0 ? (item.content ?? '...') : '...' }}
            <a-card title='详情' style='margin-top: 16px;' @click='toDetail(item)'>
              <template #cover>
                <img
                  :src='item.pictureVO ?
                  (item.pictureVO?.thumbnailUrl ?? item.pictureVO?.url)  :
                  (item.forumVO?.forumFile[0]?.thumbnailUrl ?? item.forumVO?.forumFile[0]?.picUrl)'
                  style='width: 100px;margin-left: 23px; margin-top: 16px;' />
              </template>
              <a-card-meta>
                <template #description>{{ item.pictureVO?.name ?? item.forumVO?.title }}</template>
              </a-card-meta>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
    <!--    分页插件-->
    <a-pagination style='text-align: center;'
                  v-model:current='searchParams.current'
                  :total='total'
                  v-model:pageSize='searchParams.pageSize'
                  :onChange='doChangePages' />
  </div>
</template>

<script setup lang='ts'>
import {
  CommentOutlined,
  LikeOutlined,
  ShareAltOutlined,
  PictureOutlined,
  FileImageOutlined
} from '@ant-design/icons-vue'
import { onMounted, ref } from 'vue'
import { TARGET_TYPE_ENUM } from '../constants/targetType'
import { getCommentHistoryMyUsingPost, readCommentUsingPost } from '../api/commentController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { getLoginUserUsingGet } from '../api/userController'
import { listLikeMessageVoUsingPost, readMessageUsingPost } from '../api/likeMessageController'
import { useRouter } from 'vue-router'

const router = useRouter()
//评论消息
const comList = ref<API.CommentVO[]>([])
const total = ref(0)
const loginUser = ref<API.UserVO>()
const params = ref<any>({
  isRead: 0,
  targetType: TARGET_TYPE_ENUM.PICTURE
})
//点赞/分享消息
const likeList = ref<API.LikeMessageVO[]>([])
//切换 false:返回 , true:我的互动
const backOrMyMessage = ref<boolean>(true)

//标签的切换： 0-评论，1-点赞，2-分享
const changTags = ref(0)
// 内容的切换
const messageStr = ref<string>('未读')
//图片帖子的颜色切换 0-图片，1-帖子
const picOrFor=ref<number>(0)

/**
 * 搜索消息
 */
const searchParams = ref({
  current: 1,
  pageSize: 5
})

//图片的分页
const doChangePages = (page, pageSize) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  if (changTags.value === 0) {
    getComMessage()
  } else if (changTags.value === 1) {
    getLikeMessage()
  } else {
    getShareMessage()
  }
}

const getComMessage = async () => {
  //更改标签值
  changTags.value = 0
  //得到登入用户的信息
  if (!loginUser || !loginUser.value?.id) {
    await fetchUser()
  }
  const { actionType, receiverId, ...resParams } = params.value
  //如果是顶级评论，fromId，就是目标对象的拥有人
  if (!backOrMyMessage.value) {
    //获取到我发出的评论
    params.value = {
      ...resParams,
      userId: loginUser.value?.id,
      isCommentMy: 1
    }
  } else {
    //得到评论我的人
    params.value = {
      ...resParams,
      fromId: loginUser.value?.id,
      targetUserId: loginUser.value?.id
    }
  }
  comMessage(params.value)
}

//获取未读的评论信息
const comMessage = async (param) => {

  const res = await getCommentHistoryMyUsingPost({
    ...searchParams.value,
    ...param
  })
  if (res.code === 0 && res.data) {
    comList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取评论失败')
  }
}


const getLikeMessage = () =>  {
  //更改标签值
  changTags.value = 1
  const { fromId, targetUserId,userId,isCommentMy, ...resParams } = params.value
  if (!backOrMyMessage.value) {
    params.value = {
      ...resParams,
      actionType: 0,
      sendId: loginUser.value.id
    }
  } else {
    params.value = {
      ...resParams,
      actionType: 0,
      receiverId: loginUser.value?.id
    }
  }

  likeShareMessage(params.value)
}

const getShareMessage = () => {
  //更改标签值
  changTags.value = 2
  const { fromId, targetUserId,userId,isCommentMy, ...resParams } = params.value
  if (!backOrMyMessage.value) {
    params.value = {
      ...resParams,
      actionType: 1,
      sendId: loginUser.value.id
    }
  } else {
    params.value = {
      ...resParams,
      actionType: 1,
      receiverId: loginUser.value?.id
    }
  }
  likeShareMessage(params.value)
}

/**
 * 获取点赞分享 消息
 * @param params
 */
const likeShareMessage = async (param) => {
  const res = await listLikeMessageVoUsingPost({
    ...searchParams.value,
    ...param
  })
  if (res.code === 0 && res.data) {
    likeList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取点赞分享信息失败')
  }
}

//去详情页
const toDetail = async (item) => {
  //消息修改成为已读
  if (changTags.value === 0) {
    await readCommentUsingPost({
      id: item.id,
      isRead: 1
    })
  } else {
    await readMessageUsingPost({
      id: item.id,
      isRead: 1
    })
  }

  if (item.pictureVO) {
    router.push({
      path: `/picture/${item.targetId}`
    })
  } else {
    router.push({
      path: `/forum/${item.targetId}`
    })
  }
}

//帖子数据
const changeFor = () => {
  picOrFor.value=1
  params.value = {
    ...params.value,
    targetType: TARGET_TYPE_ENUM.FORUM
  }
  if (changTags.value === 0) {
    getComMessage()
  } else if (changTags.value === 1) {
    getLikeMessage()
  } else {
    getShareMessage()
  }

}

//图片数据
const changePic = () => {
  picOrFor.value=0
  params.value = {
    ...params.value,
    targetType: TARGET_TYPE_ENUM.PICTURE
  }
  if (changTags.value === 0) {
    getComMessage()
  } else if (changTags.value === 1) {
    getLikeMessage()
  } else {
    getShareMessage()
  }
}

//获取历史消息 /就是已读消息
const doHistory = () => {
  params.value = {
    ...params.value,
    isRead: 1
  }
  messageStr.value = '已读'
  getComMessage()
}
//获取未读消息
const doRead = () => {
  params.value = {
    targetType: TARGET_TYPE_ENUM.PICTURE,
    isRead: 0
  }
  messageStr.value = '未读'
  backOrMyMessage.value = true
  getComMessage()
}


//我发出的评论
const myComment = () => {
  backOrMyMessage.value = false
  messageStr.value="我的"
  params.value = {
    targetType: TARGET_TYPE_ENUM.PICTURE
  }
  getComMessage()
}



//查询登入用户的数据
const fetchUser = async () => {
  const res = await getLoginUserUsingGet()
  if (res.code === 0 && res.data) {
    loginUser.value = res.data
  }
}

onMounted(() => {
  getComMessage()
})
</script>

<style scoped>
#message-page {
  width: 90%;
  margin: 0 auto;
}

.btn-sty {
  width: 90%;
  height: 100px;
  border-radius: 10px;
  text-align: left;
  align-items: center;
  display: flex;
  margin: 16px 0px 16px 13px;
}
.btn-color{
  background-color: #8fe2df;
  color: #524d4d;
}
</style>

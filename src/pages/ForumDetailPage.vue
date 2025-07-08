<template>
  <div id='forumDetail'>
    <a-row>
      <a-col :span='24'>
        <a-card :title='forum?.title' :bordered='false'>
          <a-card-meta :title='forum?.userVO.userName'
                       :description="dayjs(forum?.createTime).format('MM月DD日HH:mm')"
                       style='background-color: #f8f5f3;border-radius: 7px;margin-bottom: 5px;'>
            <template #avatar>
              <a-avatar :src='forum?.userVO.userAvatar' :size='48' />
            </template>
          </a-card-meta>
          <!-- 处理后的内容 -->
          <div v-html='processedContent'></div>
        </a-card>
        <div class='forumaction'>
          <p>
            <EyeOutlined />
            {{ forum?.viewCount }}
          </p>
          <p>
            <HeartOutlined @click='doLike' v-if='isLike.indexOf(forum?.id)===-1' />
            <HeartFilled @click='doUnLike' v-else style='color:red' />
            {{ forum?.likeCount }}
          </p>
          <p>
            <MessageOutlined @click='toComment' />
            {{ forum?.commentCount }}
          </p>
          <p>
            <LinkOutlined @click='doShare' />
            {{ forum?.shareCount }}
          </p>
          <p>
            <EditOutlined @click='doEdit'/>
          </p>
          <p>
            <DeleteOutlined  @click='doDelete'/>
          </p>
        </div>
      </a-col>
    </a-row>
  </div>
  <Modal ref='modalRef' :link='link' :url='forum?.forumFile[0]?.picUrl'/>
  <CommentDrawer ref='commentRef' :id='forum?.id' :targetType='1' :targetUserId='forum.userId'/>
</template>

<script lang='ts' setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  HeartOutlined,
  MessageOutlined,
  EyeOutlined,
  LinkOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { deleteForumUsingPost, getForumVoUsingGet } from '../api/forumController'
import dayjs from 'dayjs'
import Modal from '../components/ShareModal.vue'
import {
  addUserLikeUsingPost,
  addUserShareUsingPost,
  getMyLikeUsingPost,
  unUserLikeUsingPost
} from '../api/userLikeController'

import CommentDrawer from '../components/CommentDrawer.vue'
import { addLikeMessageUsingPost } from '../api/likeMessageController'

//获取动态参数
const props = defineProps<{
  id: string | number
}>()


const forum = ref<API.ForumVO>()
const router = useRouter()
/**
 * 用户是否点赞， 返回true表示已点赞
 * @param id
 */
const isLike = ref([])

const fetchForum = async () => {
  try {
    const res = await getForumVoUsingGet({
      id: props.id as number
    })
    if (res.code === 0) {
      forum.value = res.data
    } else {
      message.error('获取帖子失败')
    }
  } catch (e) {
    message.error('获取图片失败', e.message)
  }
}


/**
 * 获取我的喜欢
 */
const fetchMyLike = async () => {
  const res = await getMyLikeUsingPost({
    targetType: 1
  })
  if (res.code === 0 && res.data) {
    res.data?.likePost?.forEach(item => {
      isLike.value.push(item)
    })
  }
}

// 创建处理后的内容
const processedContent = computed(() => {
  if (!forum.value?.content) return '';

  // 创建图片映射表 {索引: 图片URL}
  const imgMap = {};
  forum.value?.forumFile.forEach(file => {
    // 使用sort值作为键（0,1,2...）
    imgMap[file.sort] = file.picUrl;
  });

  // 替换占位符为实际图片
  return forum.value.content.replace(/{img-(\d+)}/g, (match, index) => {
    if (imgMap[index]) {
      // 添加图片样式，可以根据需要调整
      return `<img
                   src="${imgMap[index]}"
                   alt="图片"
                   style="max-width: 100%; margin: 10px auto; border-radius: 4px; display: block;"/>`;
    }
    return match; // 没有找到对应图片则保持原样
  });
});



onMounted(() => {
  fetchForum()
  fetchMyLike()
})


const doDelete = async () => {
  const res = await deleteForumUsingPost({
    id: forum.value.id
  })
  if (res.code == 0) {
    message.success('删除成功')
    router.push('/forum')
  } else {
    message.error('删除失败')
  }
}

/**
 * 点赞
 */
const doLike = async () => {
  const res = await addUserLikeUsingPost({
    targetId: forum.value.id,
    targetType: 1
  })
  if (res.code === 0) {
    message.success('帖子不错，来个赞')
    forum.value.likeCount++
  } else {
    message.error('点赞失败')
  }
  isLike.value.push(forum.value.id)
  //发送消息
  await  addLikeMessageUsingPost({
    receiverId: forum.value.userId,
    targetType: 1,
    targetId: forum.value.id,
    actionType: 0
  })
}

/**
 * 取消点赞
 */
const doUnLike = async () => {
  const res=await unUserLikeUsingPost({
    targetId: forum.value.id,
    targetType: 1
  })
  if (res.code !== 0) {
    message.error('取消点赞失败')
    return;
  }
  forum.value.likeCount--
  const index = isLike.value.indexOf(forum.value.id)
  if(index > -1){
    isLike.value.splice(index,1)
  }
}

/**
 * 去评论
 */
const commentRef=ref()
const toComment = async () => {
    if(commentRef.value){
      commentRef.value.showDrawer()
    }
}

/**
 * 分享
 */
const link=ref('')
const modalRef=ref()
const doShare = async () => {
  link.value = `${window.location.protocol}//${window.location.host}/forum/${forum.value.id}`
  if(modalRef.value){
    modalRef.value.openModal()
  }
  await addUserShareUsingPost({
    targetId: forum.value.id,
    targetType: 1,
    likeShare: 1
  })
  //发送消息
   await  addLikeMessageUsingPost({
    receiverId: forum.value.userId,
    targetType: 1,
    targetId: forum.value.id,
    actionType: 1
  })
}

const doEdit=()=>{
  router.push(`/addforum?id=${props.id}`)
}

</script>

<style scoped>
#forumDetail {
  max-width: 1280px;
  margin: 0 auto;
}

.forumaction {
  position: fixed;
  left: 95%;
  top: 30%;
  background-color: #ededed;
  padding: 10px;
  border-radius: 21px;
  border: white solid 1px;
}
</style>

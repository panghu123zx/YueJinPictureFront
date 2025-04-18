<template>
  <div class='comment-drawer'>
    <a-drawer
      v-model:open='open'
      title='评论'
      placement='right'
    >
      <a-list
        item-layout='horizontal'
        :data-source='commentList'
      >
        <template #renderItem='{ item }'>
          <a-list-item>
            <a-comment :author="item?.userName ?? '无名'"
                       :avatar="item?.userAvatar  ">
              <template #actions>
                <a-space>
                  <LikeOutlined @click='doAddLike(item)' v-if='likeComment.indexOf(item.id)===-1' />
                  <LikeFilled v-else />
                  {{ item.likeCount }}
                </a-space>
                <a-space style='margin-left: 16px;' @click='deleteComment(item)'>
                  <DeleteOutlined />
                  <span style='font-size: 11px;'>删除</span>
                </a-space>

                <span style='margin-left: 16px;' @click='replyComment(item)'>回复</span>
              </template>
              <template #content>
                <p>
                  {{ item.content }}
                </p>
              </template>

              <template #datetime>
                <a-tooltip>
                  <span>{{ dayjs(item.createTime).format('YYYY-MM-DD') }}</span>
                </a-tooltip>
              </template>

              <a-comment
                v-for='childItem in item.commentVOChildList'
                :key='childItem.id'
                :author="`${childItem.userName ?? '无名'} ▶ ${childItem.fromName ?? '无名'}`"
                :avatar="childItem?.userAvatar ">
                <template #actions>
                  <a-space>
                    <LikeOutlined @click='doAddLike(childItem)' v-if='likeComment.indexOf(childItem.id)===-1' />
                    <LikeFilled v-else />
                    {{ childItem.likeCount }}
                  </a-space>
                  <a-space style='margin-left: 16px;' @click='deleteComment(childItem)'>
                    <DeleteOutlined />
                    <span style='font-size: 11px;'>删除</span>
                  </a-space>
                  <span style='margin-left: 16px;' @click='replyChildComment(childItem)'>回复</span>
                </template>
                <template #content>
                  <p>
                    {{ childItem.content }}
                  </p>
                </template>

                <template #datetime>
                  <a-tooltip>
                    <span>{{ dayjs(childItem.createTime).format('YYYY-MM-DD') }}</span>
                  </a-tooltip>
                </template>
              </a-comment>
            </a-comment>
          </a-list-item>
        </template>
      </a-list>

      <a-divider class='replyComment' v-if='isShow'>输入框中请输入你需要回复的信息
        <a-tag :bordered='false' style='color: #dcbbbb;' @click='unReplyComment'>取消回复</a-tag>
      </a-divider>
      <a-space class='input-comment'>
        <a-input v-model:value='content' show-count :maxlength='200' placeholder='请输入你的评论...' />
        <a-button style='color: #666666' @click='doAddComment'>发送</a-button>
      </a-space>
    </a-drawer>
  </div>
</template>
<script lang='ts' setup>
import { defineExpose, defineProps, onMounted, ref, watch } from 'vue'
import {
  addCommentUsingPost,
  deleteCommentUsingPost,
  getTargetCommentUsingPost,
  likeCommentUsingPost
} from '../api/commentController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { LikeFilled, LikeOutlined, DeleteOutlined } from '@ant-design/icons-vue'



interface Props {
  id: number | string
}

const props = defineProps<Props>()

const open = ref<boolean>(false)

const content = ref()

//评论列表
const commentList = ref<API.CommentVO[]>([])

//点赞的评论id，评论是可以无限点赞的
const likeComment = ref([])

//添加评论时的参数值
const params = ref<API.AddCommentDto>()

/**
 * 回复评论
 */
const isShow = ref(false)
const replyComment = async (item) => {
  isShow.value = true
  params.value = {
    fromName: item.userName,
    fromId: item.userId,
    parentId: item.id
  }
}

const replyChildComment=(childItem)=>{
  isShow.value=true
  params.value={
    parentId: childItem.parentId,
    fromName: childItem.userName,
    fromId: childItem.userId,
  }
}

/**
 * 取消回复
 */
const unReplyComment = () => {
  isShow.value = false
  params.value = {}
}

/**
 * 删除评论
 */
const deleteComment = async (item) => {
  const res = await deleteCommentUsingPost({
    id: item.id
  })
  if (res.code === 0) {
    message.success('删除成功')
    fetchCommentData()
  } else {
    message.error('删除失败')
  }
}

/**
 * 点赞
 */
const doAddLike = async (item) => {
  const res = await likeCommentUsingPost({
    id: item.id
  })
  if (res.code === 0) {
    message.success('点赞成功')
    item.likeCount++
    likeComment.value.push(item.id)
  } else {
    message.error('点赞失败' + res.message)
  }
}


/**
 * 获取目标的评论
 */
const fetchCommentData = async () => {
  const res = await getTargetCommentUsingPost({
    targetId: props.id as number,
    targetType: 0
  })
  if (res.code === 0 && res.data) {
    commentList.value = res.data
  } else {
    message.error('获取评论失败' + res.message)
  }
}

/**
 * 添加评论
 */
const doAddComment = async () => {
  if (!content.value) {
    message.error('评论内容不能为空')
    return
  }


  params.value.targetId = props.id as number
  params.value.targetType =0
  params.value.content = content.value

  const res = await addCommentUsingPost({
    ...params.value
  })
  if (res.code === 0) {
    message.success('评论成功')
  } else {
    message.error('评论失败' + res.message)
  }
  content.value = ''
  isShow.value = false
  params.value = {}
  fetchCommentData()
}


watch(() => props.id
  , (newPictureId) => {
    fetchCommentData()
  })


/**
 * 打开弹框
 */
const showDrawer = () => {
  isShow.value = false
  params.value = {}
  open.value = true
}

defineExpose({
  showDrawer
})
</script>


<style scoped>
.input-comment {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 10px;
  max-height: 100%;
  max-width: 100%;
  border-top: 1px solid #f0f0f0;
  position: absolute;
  bottom: 17px;
}

.replyComment {
  position: absolute;
  bottom: 59px;
  color: #dcbbbb;
}
</style>

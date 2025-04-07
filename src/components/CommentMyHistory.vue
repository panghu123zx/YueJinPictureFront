<template>
  <div class='comment-my'>
    <a-modal v-model:open='visible' title='评论我的历史' :footer='false' @cancel='closeModal'>
      <a-list
        :data-source="commentList"
        :pagination='pagination'
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-comment :author="item.userName ?? '无名'" :avatar="item.userAvatar  ">
              <template #actions>
                <a-space>
                  <LikeFilled />
                  {{ item.likeCount }}
                </a-space>
              </template>

              <template #content>
                <p>
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
    </a-modal>
  </div>
</template>

<script lang='ts' setup>
import { defineExpose, ref } from 'vue'
import { message } from 'ant-design-vue'
import { getCommentHistoryMyUsingPost } from '../api/commentController'
import { LikeFilled } from '@ant-design/icons-vue'
import dayjs from 'dayjs'



const visible = ref(false)
const commentList=ref<API.CommentVO[]>([])
//分页参数
const pagination = {
  onChange: (page: number) => {
  },
  pageSize: 3,
};


const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

const fetchCommentMy=async ()=>{
  const res = await getCommentHistoryMyUsingPost({})
  if(res.code===0 && res.data){
    commentList.value=res.data.records ?? []
  }else{
    message.error('获取评论历史失败'+res.data)
  }
}


//暴露函数
defineExpose({
  openModal,
  fetchCommentMy
})
</script>

<style scoped>
.comment-my {
}
</style>

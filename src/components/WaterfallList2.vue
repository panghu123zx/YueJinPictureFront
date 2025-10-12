<template>
  <div class='page-b-content'>
    <div class='waterfall-container'>
      <Waterfall
        :list='dataList'
        :width='300'
        :breakpoints='breakpoints'
      >
        <template #default='{ item, url }'>
          <div
            class='custom-card'
            @mouseenter='handleMouseEnter(item.id)'
            @mouseleave='handleMouseLeave(item.id)'
          >
            <!-- 图片容器 -->
            <div class='image-wrap'>
              <LazyImg
                :url='item.thumbnailUrl ?? item.url'
                @click='toPictureDetail(item)'
                class='card-image'
              />
              <!-- 常驻浏览量 -->
              <div class='views'>
                <EyeOutlined />
                {{ formatView(item.viewCount) }}
              </div>

              <!-- 悬浮显示的作者信息（左下角） -->
              <transition name='fade-in'>
                <div
                  v-if='hoverStates[item.id]'
                  class='author-info'
                >
                  <span class='author-name'>{{item.name}}</span>
                </div>
              </transition>
            </div>

            <!-- 悬浮显示的操作按钮（右侧） -->
            <transition-group
              name='slide-right'
              class='hover-actions'
              tag='div'
              :class="{ 'show': hoverStates[item.id] }"
            >
              <div
                v-if='hoverStates[item.id]'
                :key="item.id + '-hover'"
              >
                <div class='actions'>
                  <a-space direction='vertical'>
                    <a-space>
                      <LikeOutlined
                        @click='addlike(item)'
                        v-if='isLike.indexOf(item.id) === -1'
                      />
                      <LikeTwoTone
                        @click='unlike(item)'
                        v-else
                        two-tone-color='#f5a0af'
                      />
                    </a-space>
                  </a-space>
                </div>
              </div>
            </transition-group>
          </div>
        </template>
      </Waterfall>
    </div>
  </div>

</template>

<script setup lang='ts'>
import { computed, defineProps, onMounted, ref, watchEffect, withDefaults } from 'vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import {
  ShareAltOutlined,
  LikeOutlined,
  EyeOutlined,
  SearchOutlined,
  LikeFilled,
  CommentOutlined,
  LikeTwoTone
} from '@ant-design/icons-vue'
import 'vue-waterfall-plugin-next/dist/style.css'
import { useRouter } from 'vue-router'
import {
  addUserLikeUsingPost,
  addUserShareUsingPost, getMyLikeUsingPost,
  unUserLikeUsingPost
} from '../api/userLikeController'
import { message } from 'ant-design-vue'
import Modal from '../components/ShareModal.vue'
import CommentDrawer from './CommentDrawer.vue'
import { addLikeMessageUsingPost } from '../api/likeMessageController'
import {formatView} from '../utils/index'
import { useLoginuserStore } from '../stores/loginuserStore'

//  hover 状态管理（避免多个卡片互相干扰）
const hoverStates = ref({})
// 鼠标移入事件
const handleMouseEnter = (id) => {
  hoverStates.value[id] = true
}

// 鼠标移出事件
const handleMouseLeave = (id) => {
  hoverStates.value[id] = false
}

const router = useRouter()


interface Props {
  dataList: API.PictureVO[],
  showOptions: boolean,
  loading: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  showOptions: false,
  loading: false
})

const useLoginUser = useLoginuserStore()

/**
 * 瀑布流布局
 */
const breakpoints = ref({
  3000: {
    //当屏幕宽度小于等于3000
    rowPerView: 8 // 一行8图
  },
  1800: {
    rowPerView: 6
  },
  1500: {
    rowPerView: 5
  },
  1200: {
    rowPerView: 4
  },
  1000: {
    rowPerView: 3
  },
  800: {
    rowPerView: 2
  },
  700: {
    rowPerView: 2
  },
  500: {
    rowPerView: 1
  },
  300: {
    rowPerView: 1
  }
})

/**
 * 用户是否点赞， 返回true表示已点赞
 * @param id
 */
const isLike = ref([])

/**
 * 图片详情页
 */
const toPictureDetail = (item) => {
  router.push({
    path: `/picture/${item.id}`
  })
  item.viewCount++
}

/**
 * 获取我的喜欢
 */
const fetchMyLike = async () => {
  if(!useLoginUser?.loginUser?.id){
    return;
  }
  const res = await getMyLikeUsingPost({
    targetType: 0
  })
  if (res.code === 0 && res.data) {
    res.data?.forEach(item => {
      isLike.value.push(item)
    })
  }
}

onMounted(() => {
  fetchMyLike()
})

/**
 * 添加点赞
 */
const addlike = async (item) => {
  const res = await addUserLikeUsingPost({
    targetId: item.id,
    targetType: 0
  })
  if (res.code === 0) {
    message.success('图片不错，来个赞')
    item.likeCount++
  } else {
    message.error('点赞失败'+res.data)
  }
  //发送消息
  await addLikeMessageUsingPost({
    receiverId: item.userId,
    targetType: 0,
    targetId: item.id,
    actionType: 0
  })
  isLike.value.push(item.id)
}

/**
 * 取消点赞
 * @param item
 */
const unlike = async (item) => {
  const res = await unUserLikeUsingPost({
    targetId: item.id,
    targetType: 0
  })
  if (res.code !== 0) {
    message.error('取消点赞失败'+res.data)
    return
  }
  item.likeCount--
  const index = isLike.value.indexOf(item.id)
  if (index > -1) {
    isLike.value.splice(index, 1)
  }
  fetchMyLike()
}

const commentRef = ref()
const pictureId = ref()
const targetUserId=ref()
const toComment = (item) => {
  pictureId.value = item.id
  targetUserId.value=item.userId
  if (commentRef.value) {
    commentRef.value.showDrawer()
  }
}
</script>

<style scoped>
.waterfall-container {
}

.custom-card {
  position: relative;
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #f4ebeb;
  border-radius: 7%;
}

.image-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
  overflow: hidden;
}

.image-wrap .card-image{
  transition: transform 0.3s ease; /* 添加过渡动画 */
  width: 100%;
  height: auto;
  display: block;
}

.image-wrap:hover .card-image{
  transform: scale(1.1);
}



.card-image {
  width: 100%;
  height: auto;
  display: block;
}

.views {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgb(185 177 177 / 50%);
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  z-index: 2;
}

.hover-actions {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: flex-start;
  padding-top: 40px;
  z-index: 3;
  transform: translateX(1%);
  transition: transform 0.3s ease;
}

.hover-actions.show {
  transform: translateX(0);
}

.author-info {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* 鼠标悬浮时显示作者信息 */
.custom-card:hover .author-info {
  opacity: 1;
  transform: translateY(0);
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-name {
  color: white;
}

.actions {
  margin-right: 8px;
  background: rgb(137 134 134 / 40%);
  padding: 12px;
  border-radius: 8px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

/* 右侧滑入动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(1%);
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}

/* 淡入动画 */
.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.3s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}

.fade-in-enter-to,
.fade-in-leave-from {
  opacity: 1;
}
</style>

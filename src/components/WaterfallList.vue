<template>
  <div class='page-b-content'>
    <Waterfall
      :list='dataList'
      :width='300'
      :breakpoints='breakpoints'
    >
      <template #default='{ item, url }'>

        <a-card>

          <template #cover>
            <div @click='toPictureDetail(item)'>
              <LazyImg :url='item.thumbnailUrl ?? item.url' />
            </div>
          </template>
          <a-card-meta :title='item.name' :description='`作者: ${item.user.userName}`'>
            <template #avatar>
              <a-avatar v-if='item.user.userAvatar' :src='item.user.userAvatar' />
            </template>
          </a-card-meta>

          <template #actions>
            <a-space>
              <EyeOutlined />
              {{ item.viewCount }}
            </a-space>
            <a-space>
              <LikeOutlined @click='addlike(item)' v-if='isLike.indexOf(item.id)===-1 ' />
              <LikeTwoTone  @click='unlike(item)' v-else two-tone-color='#f5a0af'/>
              {{ item.likeCount }}
            </a-space>
            <a-space @click='doSharePicture(item)'>
              <ShareAltOutlined />
              {{ item.shareCount }}
            </a-space>
            <a-space @click='toComment(item)'>
              <CommentOutlined />
              {{ item.commentCount }}
            </a-space>
            <SearchOutlined @click='toImageByPic(item)' />
          </template>
        </a-card>
      </template>
    </Waterfall>
    <Modal ref='modalRef' :link='link' :url='url' />
    <CommentDrawer ref='commentRef' :id='pictureId'/>
  </div>

</template>

<script setup lang='ts'>
import { computed, defineProps, onMounted, ref, watchEffect, withDefaults } from 'vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import { ShareAltOutlined, LikeOutlined, EyeOutlined, SearchOutlined, LikeFilled,CommentOutlined,LikeTwoTone  } from '@ant-design/icons-vue'
import 'vue-waterfall-plugin-next/dist/style.css'
import { useRouter } from 'vue-router'
import {
  addUserLikeUsingPost,
  addUserShareUsingPost,
  getMyLikeUsingGet,
  unUserLikeUsingPost
} from '../api/userLikeController'
import { message } from 'ant-design-vue'
import Modal from '../components/ShareModal.vue'
import CommentDrawer from './CommentDrawer.vue'

const router = useRouter()


interface Props {
  dataList: () => [],
  showOptions: boolean,
  loading: boolean,
  onReload: () => {},
  canEdit: boolean,
  canDelete: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: false,
  canDelete: false,
  showOptions: false,
  loading: false
})


/**
 * 瀑布流布局
 */
const breakpoints = ref({
  3000: {
    //当屏幕宽度小于等于3000
    rowPerView: 7 // 一行8图
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
  const res = await getMyLikeUsingGet()
  if (res.code === 0) {
    res.data?.likePic?.forEach(item => {
      isLike.value.push(item.id)
    })
  }
}

onMounted(() => {
  fetchMyLike()
})

/**
 * 以图搜图
 */
const toImageByPic = (item) => {
  router.push(`/imagesearch?pictureId=${item.id}`)
}

/**
 * 分享图片
 */
const link = ref<string>()
const modalRef = ref()
const url = ref<string>()
const doSharePicture = async (item) => {
  link.value = `${window.location.protocol}//${window.location.host}/picture/${item.id}`
  url.value = item.url
  item.shareCount++
  if (modalRef.value) {
    modalRef.value.openModal()
  }
  const res = await addUserShareUsingPost({
    targetId: item.id,
    targetType: 0,
    likeShare: 1
  })
}

/**
 * 添加点赞
 */
const addlike = async (item) => {
  const res = await addUserLikeUsingPost({
    targetId: item.id,
    targetType: 0
  })
  if (res.code === 0) {
    message.success('点赞成功')
    item.likeCount++
  } else {
    message.error('点赞失败')
  }
  fetchMyLike()
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
  item.likeCount--
  if (res.code === 0) {
    message.success('取消点赞成功')
  } else {
    message.error('取消点赞失败')
  }
  fetchMyLike()
}

const commentRef=ref()
const pictureId=ref()
const toComment=(item)=>{
  pictureId.value=item.id
  if(commentRef.value){
    commentRef.value.showDrawer()
  }
}
</script>

<style scoped>

</style>

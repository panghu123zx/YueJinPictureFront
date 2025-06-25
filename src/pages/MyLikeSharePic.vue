<template>
  <!-- 图片列表 -->
  <a-space class='tagsTable'>
    <a-button @click='getMyLike' style='width: 100px;height: 40px;background-color: #e9bb76;color: #704c4c'>我的点赞</a-button>
    <a-button @click='getMyShare' style='width: 100px;height: 40px;background-color: #e9bb76;color: #704c4c'>我的分享</a-button>
  </a-space>

  <a-list
    :grid='{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }'
    :data-source='pictureList'
    :pagination='pagination'
    :loading='loading'
  >
    <template #renderItem='{item :picture}'>
      <a-list-item style='padding: 10px'>
        <a-card hoverable style='width: 240px;' @click='doPictureDetail(picture)'>
          <template #cover>
            <img :alt='picture.name' :src='picture.thumbnailUrl ?? picture.url' style='height: 180px;object-fit: cover' loading='lazy' />
          </template>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang='ts' setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getListPictureByVoUsingPost, getMyListPictureByVoUsingPost, listPictureTagCategoryUsingGet
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { CheckCircleOutlined ,CloseCircleOutlined,DashOutlined } from '@ant-design/icons-vue'
import 'vue3-colorpicker/style.css'
import { useLoginuserStore } from '../stores/loginuserStore'
import { PIC_REVIEW_STATUS_OPTIONS,PIC_REVIEW_STATUS_ENUM } from '../constants/picture'
import { TARGET_TYPE_ENUM } from '../constants/targetType'
import { LIKE_TYPE_ENUM } from '../constants/likeShare'
import { getLoginUserUsingGet } from '../api/userController'
import { getLikePicUsingPost } from '../api/userLikeController'


const pictureList = ref<API.PictureVO[]>()
const router = useRouter()
const total = ref(0)
const loading = ref(true)




//分页参数
const pagination = {
  onChange: (page: number) => {
  },
  pageSize: 12,
};

//获取我点赞的图片信息
const fetchMyPicture = async () => {
  loading.value = true

  const res = await getLikePicUsingPost({
    targetType: TARGET_TYPE_ENUM.PICTURE
  })
  if (res.code === 0) {
    pictureList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取数据失败')
  }
  loading.value = false
}


//获取我收藏的图片信息
const fetchMySharePicture = async () => {
  loading.value = true

  const res = await getLikePicUsingPost({
    targetType: TARGET_TYPE_ENUM.PICTURE,
    likeShare: LIKE_TYPE_ENUM.SHARE
  })
  if (res.code === 0) {
    pictureList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取数据失败')
  }
  loading.value = false
}


/**
 * 跳转图片详情页
 * @param picture
 */
const doPictureDetail = (picture) => {
  router.push({
    path: `/picture/${picture.id}`
  })
}


onMounted(() => {
  fetchMyPicture()
})


const getMyLike=()=>{
  fetchMyPicture()
}

const getMyShare=()=>{
  fetchMySharePicture()
}


</script>

<style scoped>
.tagsTable{
  margin-left: 41%;
}
</style>

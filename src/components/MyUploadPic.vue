<template>
  <!-- 图片列表 -->
  <a-list
    :grid='{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }'
    :data-source='pictureList'
    :pagination='paginationParams'
    :loading='loading'
  >
    <template #renderItem='{item :picture}'>
      <a-list-item style='padding: 10px'>
        <a-card hoverable style='width: 240px;' @click='doPictureDetail(picture)'>
          <template #cover>
            <img :alt='picture.name' :src='picture.thumbnailUrl ?? picture.url' style='height: 180px;object-fit: cover' loading='lazy' />
          </template>
          <a-card-meta :title='picture.name' />
          <a-card-meta v-if='picture.reviewStatus === PIC_REVIEW_STATUS_ENUM.REVIEWING' description='待审阅' style='margin-top: 20px;'>
            <template #avatar>
              <DashOutlined  style='margin-left: 50px;'/>
            </template>
          </a-card-meta>
          <a-card-meta v-if='picture.reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS' description='已通过' style='margin-top: 20px;color: #6bb66e'>
            <template #avatar >
              <CheckCircleOutlined style='margin-left: 50px;color: #6bb66e'/>
            </template>
          </a-card-meta>
          <a-card-meta v-if='picture.reviewStatus === PIC_REVIEW_STATUS_ENUM.REJECT' title='拒绝' style='margin-top: 20px;'>
            <template #avatar>
              <CloseCircleOutlined style='margin-left: 50px; color: #f15151'/>
            </template>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang='ts' setup>
import { computed, defineProps, onMounted, reactive, ref } from 'vue'
import {
  getListPictureByVoUsingPost, getMyListPictureByVoUsingPost, listPictureTagCategoryUsingGet
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { CheckCircleOutlined ,CloseCircleOutlined,DashOutlined } from '@ant-design/icons-vue'
import 'vue3-colorpicker/style.css'
import { useLoginuserStore } from '../stores/loginuserStore'
import { PIC_REVIEW_STATUS_OPTIONS,PIC_REVIEW_STATUS_ENUM } from '../constants/picture'
import { getLoginUserUsingGet } from '../api/userController'

interface Props {
  searchParams: API.PictureQueryDto,
  onSuccess: ()=>void
  pictureList: API.PictureVO[]
  loading: boolean
  total: number
}

const props=defineProps<Props>()

const router = useRouter()


const paginationParams = computed(() => {
  return {
    current: props.searchParams.current ?? 1,
    pageSize: props.searchParams.pageSize ?? 12,
    total: props.total,
    showPageSizeChanger: true,
    showTotal: (total) => `共${total}条`,
    onChange: (page, pageSize) => {
      props.searchParams.current = page
      props.searchParams.pageSize = pageSize
      props.onSuccess()
    }
  }
})
/**
 * 跳转图片详情页
 * @param picture
 */
const doPictureDetail = (picture) => {
  router.push({
    path: `/picture/${picture.id}`
  })
}





</script>

<style scoped>

</style>

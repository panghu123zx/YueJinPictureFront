<template>
  <!-- 图片列表 -->
  <a-list
    :grid='{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }'
    :data-source='dataList'
    :pagination='paginationParams'
    :loading='loading'
  >
    <ShareModal ref='modalRef' :link='link' :url='shareUrl'/>
    <template #renderItem='{item :picture}'>
      <a-list-item style='padding: 10px'>
        <a-card hoverable style='width: 240px;' @click='doPictureDetail(picture)'>
          <template #cover>
            <img :alt='picture.name' :src='picture.thumbnailUrl ?? picture.url' style='height: 180px;object-fit: cover' loading='lazy' />
          </template>
          <template #actions v-if='showOptions'>
            <SearchOutlined @click='e=>doSearch(picture,e)' />
            <ShareAltOutlined @click='e=>doShare(picture,e)' />
            <EditOutlined v-if='canEdit' @click='e=>doEdit(picture,e)' />
            <DeleteOutlined v-if='canDelete' @click='e=>doDelete(picture,e)' />
          </template>
          <a-card-meta :title='picture.name'>
            <template #description>
              <a-flex>
                <a-tag color='green'>{{ picture.category ?? '默认' }}</a-tag>
                <a-tag v-for='tag in picture.tags' :key='tag'>
                  {{ tag }}
                </a-tag>
              </a-flex>
            </template>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </template>
  </a-list>


</template>

<script lang='ts' setup>
import { defineProps, ref, withDefaults } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined, DeleteOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '../api/pictureController'
import { message } from 'ant-design-vue'
import ShareModal from './ShareModal.vue'

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
 * 跳转图片详情页
 * @param picture
 */
const doPictureDetail = (picture) => {
  router.push({
    path: `/picture/${picture.id}`
  })
}
//编辑图片
const doEdit = (picture, e) => {
  e.stopPropagation()
  router.push({
    path: '/addpicture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId
    }
  })
}
//删除图片
const doDelete = async (picture, e) => {
  e.stopPropagation()
  if (picture.id === null) {
    return
  }
  const res = await deletePictureUsingPost({
    id: picture.id
  })
  if (res.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败:' + res.data)
  }
  props?.onReload()
}
//以图搜图
const doSearch = (picture, e) => {
  e.stopPropagation()
  router.push(`/imagesearch?pictureId=${picture.id}`)
}

const modalRef = ref()
const link = ref<string>()
const shareUrl=ref()
//分享图片
const doShare = (picture, e) => {
  e.stopPropagation()
  link.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  shareUrl.value=picture.url
  if (modalRef.value) {
    modalRef.value.openModal()
  }
}
</script>

<style scoped>

</style>

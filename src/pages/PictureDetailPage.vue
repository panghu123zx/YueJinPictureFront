<template>
  <a-row :gutter='[16,16]'>
    <a-col :sm='24' :md='16' :xl='18'>
      <a-card title='图片预览' style='text-align: center; '>
        <a-image :src='picture?.url' :alt='picture?.name' style='max-height: 600px; object-fit: contain' />
      </a-card>
    </a-col>
    <a-col :sm='24' :md='8' :xl='6'>
      <a-card title='图片信息'>
        <a-descriptions :column='1'>
          <a-descriptions-item label='作者'>
            <a-space>
              <a-avatar :src='picture?.user?.userAvatar ' />
              {{ picture?.user?.userName }}
            </a-space>

          </a-descriptions-item>
          <a-descriptions-item label='名称'>
            {{ picture?.name }}
          </a-descriptions-item>
          <a-descriptions-item label='简介'>{{ picture?.introduction ?? '--' }}</a-descriptions-item>
          <a-descriptions-item label='分类'>{{ picture?.category ?? '--' }} </a-descriptions-item>
          <a-descriptions-item label='标签'>
            <a-space v-if='picture?.tags.length >0'>
              <a-tag v-for='tag in picture?.tags' :key='tag' color='green'>{{ tag }}</a-tag>
            </a-space>
            <span v-else>--</span>
          </a-descriptions-item>
          <a-descriptions-item label='格式'>{{ picture?.picFormat }}</a-descriptions-item>
          <a-descriptions-item label='宽度'>{{ picture?.picWidth }}</a-descriptions-item>
          <a-descriptions-item label='高度'>{{ picture?.picHeight }}</a-descriptions-item>
          <a-descriptions-item label='宽高比'>{{ picture?.picScale }}</a-descriptions-item>
          <a-descriptions-item label='大小'>{{ formatSize(picture?.picSize) }}</a-descriptions-item>
          <a-descriptions-item label='主色调'>
              <div v-if='picture?.picColor' :style='{
                backgroundColor: toHexColor(picture?.picColor),
                width: "50px",
                height: "20px",
              }'/>
            <div v-else>--</div>
          </a-descriptions-item>
          <a-descriptions-item>
            <a-space wrap>
              <a-button  @click='doDownload' style='background-color: #6bb66e; width: 45px'>
                <template #icon>
                  <DownloadOutlined  style='color: white; font-size: medium' />
                </template>
              </a-button>
              <a-button  @click='doShare'  style='background-color: #2196f3; width: 45px'>
                <template #icon>
                  <ShareAltOutlined style='color: white; font-size: medium'/>
                </template>
              </a-button>
              <a-button v-if='canEditPicture' type='default' @click='doEdit'  style='background-color: #ffc107; width: 45px'>

                <template #icon>
                  <EditOutlined style='color: white; font-size: medium'/>
                </template>
              </a-button>
              <a-button v-if='canDeletePicture'  @click='doDelete'  style='background-color: #f44336; width: 45px'>

                <template #icon>
                  <DeleteOutlined style='color: white; font-size: medium'/>
                </template>
              </a-button>
              <a-button   @click='toComment' v-if='!picture?.spaceId' style='background-color: #ff9800; width: 45px'>

                <template #icon>
                  <CommentOutlined style='color: white; font-size: medium'/>
                </template>
              </a-button>
            </a-space>
          </a-descriptions-item>

        </a-descriptions>
      </a-card>
    </a-col>
  </a-row>
  <Modal ref='modalRef' :link='link' :url='picture?.url'/>
  <CommentDrawer ref='commentRef' :id='picture?.id'/>
</template>

<script lang='ts' setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import { deletePictureUsingPost, getPictureByIdVoUsingGet } from '../api/pictureController'
import { message } from 'ant-design-vue'
import { formatSize, downloadImage ,toHexColor} from '../utils/index.ts'
import { DeleteOutlined, EditOutlined, DownloadOutlined ,ShareAltOutlined,CommentOutlined} from '@ant-design/icons-vue'
import { useLoginuserStore } from '../stores/loginuserStore'
import { useRouter } from 'vue-router'
import Modal from '../components/ShareModal.vue'
import { SPACE_PERMISSION_ENUM } from '../constants/spaceuser'
import CommentDrawer from '../components/CommentDrawer.vue'

//获取动态参数
const props = defineProps<{
  id: string | number
}>()
const loginUserStore = useLoginuserStore()
const picture = ref<API.PictureVO>()
const router = useRouter()

const fetchPicture = async () => {
  try {
    const res = await getPictureByIdVoUsingGet({
      id: props.id as number
    })
    if (res.code === 0) {
      picture.value = res.data
    } else {
      message.error('获取图片失败')
    }
  } catch (e) {
    message.error('获取图片失败', e.message)
  }
}

onMounted(() => {
  fetchPicture()
})

const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  //没登入不可以编辑
  if (!loginUser) {
    return false
  }
  //本人和管理员可以编辑
  const user = picture.value?.user || {}
  return loginUser?.id === user.id || loginUser?.userRole === 'admin'
})

const doEdit = () => {
  router.push({
    path: '/addpicture',
    query: {
      id: picture.value.id,
      spaceId: picture.value?.spaceId
    }
  })
}

const doDelete = async () => {
  const res = await deletePictureUsingPost({
    id: picture.value.id
  })
  if (res.code == 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
}

// 处理下载
const doDownload = () => {
  downloadImage(picture.value.url)
}

const modalRef=ref()
const link= ref('')

const doShare = () => {
  link.value= `${window.location.protocol}//${window.location.host}/picture/${picture.value.id}`
  if(modalRef.value){
    modalRef.value.openModal()
  }
}

const commentRef=ref()
const toComment=()=>{
  if(commentRef.value){
    commentRef.value.showDrawer()
  }
}

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (picture.value?.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)


</script>

<style scoped>

</style>

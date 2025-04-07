<template>
  <a-modal class='pictureCropper' v-model:open='visible' title='裁剪图片' :footer='false' @cancel='closeModal'>
    <vue-cropper ref='vueCropperRef'
                 :img='imgUrl'
                 :autoCrop='true'
                 :fixedBox='false'
                 :info='true'
                 :canMove='false'
                 :canMoveBox='true'
                 outputType='png'
    />
    <div style='margin-bottom: 16px;' />
    <!-- 协同编辑操作 -->
    <div class='image-edit-actions' v-if='isTeamSpace'>
      <a-space>
        <a-button v-if='editingUser' disabled> {{ editingUser.userName }}正在编辑</a-button>
        <a-button v-if='canEnterEdit' type='primary' ghost @click='enterEdit'>进入编辑</a-button>
        <a-button v-if='canExitEdit' danger ghost @click='exitEdit'>退出编辑</a-button>
      </a-space>
    </div>

    <div class='test-button'>
      <a-space>
        <a-button @click='rotateLeft' :disabled='!canEdit'>向左旋转</a-button>
        <a-button @click='rotateRight' :disabled='!canEdit'>向右旋转</a-button>
        <a-button @click='changeScale(1)' :disabled='!canEdit'>放大</a-button>
        <a-button @click='changeScale(-1)' :disabled='!canEdit'>缩小</a-button>
        <a-button type='primary' :loading='loading' :disabled='!canEdit' @click='doSubmit'>
          确认
        </a-button>
      </a-space>

    </div>
  </a-modal>
</template>

<script lang='ts' setup>
import { computed, defineExpose, defineProps, onUnmounted, ref, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { editPictureUsingPost, uploadPictureUsingPost } from '../api/pictureController'
import PictureEditWebSocket from '../utils/WebSocket'
import { PICTURE_EDIT_ACTION_ENUM, PICTURE_EDIT_MESSAGE_TYPE_ENUM } from '../constants/picture'
import { useLoginuserStore } from '../stores/loginuserStore'
import { SPACE_TYPE_ENUM } from '../constants/spaceuser'

interface Props {
  imgUrl?: string
  picture?: API.PictureVO,
  spaceId?: '',
  space?: API.SpaceVO,
  onSuccess?: (newPicture: API.PictureVO) => void,
}

const props = defineProps<Props>()
const loading = ref<boolean>(false)
const vueCropperRef = ref()
const visible = ref(false)
//websocket
let websocket: PictureEditWebSocket | null

//判断是否为团队空间
const isTeamSpace = computed(() => {
  return props.space?.spaceType === SPACE_TYPE_ENUM.TEAM
})

// --------- 实时编辑 ---------
const loginUserStore = useLoginuserStore()
let loginUser = loginUserStore.loginUser
// 正在编辑的用户
const editingUser = ref<API.UserVO>()
// 没有用户正在编辑中，可进入编辑
const canEnterEdit = computed(() => {
  return !editingUser.value
})
// 正在编辑的用户是本人，可退出编辑
const canExitEdit = computed(() => {
  return editingUser.value?.id === loginUser.id
})
// 可以编辑
const canEdit = computed(() => {
  //不是团队空间时，默认可以编辑
  if (!isTeamSpace.value) {
    return true
  }
  return editingUser.value?.id === loginUser.id
})

//
const rotateLeft = () => {
  vueCropperRef.value.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}

const rotateRight = () => {
  vueCropperRef.value.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}

const changeScale = (num) => {
  vueCropperRef.value.changeScale(num)
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
}


//确认裁剪
const doSubmit = () => {
  editingUser.value = undefined
  vueCropperRef.value.getCropBlob((blob: Blob) => {
    // blob 为已裁切的文件
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, { type: blob.type })
    handleUpload({ file })
    visible.value = false
  })
}
//上传函数
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadDto = props.picture ? {
      id: props.picture.id
    } : {}
    params.spaceId = props.spaceId
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.code === 0) {
      props.onSuccess?.(res.data)
      message.success('上传图片成功')
    } else {
      message.error('上传图片失败')
    }
  } catch (e) {
    message.error('上传图片失败:{}', e.message)
  } finally {
    loading.value = false
    visible.value = false
  }
}
//打开弹窗
const openModal = () => {
  visible.value = true
}

//关闭弹窗
const closeModal = () => {
  visible.value = false
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
}

//进入编辑状态
const enterEdit = () => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT
    })
  }
}
//退出编辑状态
const exitEdit = () => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT
    })
  }
}

//编辑图片操作
const editAction = (action: string) => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      editAction: action
    })
  }
}


//初始化 WebSocket 连接，绑定事件
const initWebSocket = () => {
  const pictureId = props.picture?.id
  if (!pictureId || !visible.value) {
    return
  }
  //防止websocket未被释放
  if (websocket) {
    websocket.disconnect()
  }
  //创建webSocket实例
  websocket = new PictureEditWebSocket(pictureId)
  //建立 webSocket 连接
  websocket.connect()

  //监听消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg: any) => {
    console.log('收到消息:', msg)
    message.info(msg.message)
  })

  //监听错误
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg: any) => {
    console.error('收到错误消息:', msg)
    message.error(msg.message)
  })

  //监听进入编辑状态
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg: any) => {
    console.log('收到进入编辑状态消息:', msg)
    message.info(msg.message)
    editingUser.value = msg.user
  })

  //监听退出编辑状态
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg: any) => {
    console.log('收到退出')
    message.info(msg.message)
    editingUser.value = undefined
  })


  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg: any) => {
    console.log('收到编辑操作消息:', msg)
    message.info(msg.message)
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        vueCropperRef.value.changeScale(1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        vueCropperRef.value.changeScale(-1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        vueCropperRef.value.rotateLeft()
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        vueCropperRef.value.rotateRight()
        break
    }
  })
}

watchEffect(() => {
  //当前空间是团队空间时，开始连接
  if (isTeamSpace.value) {
    initWebSocket()
  }
})


//界面销毁之后，断开websocket连接
onUnmounted(() => {
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
})


defineExpose({
  openModal
})
</script>

<style scoped>
.pictureCropper {
  text-align: center;
}

.image-edit-actions {
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
}

.pictureCropper .vue-cropper {
  height: 400px;
}
</style>

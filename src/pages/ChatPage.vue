<template>
  <div id='chat'>
    <a-row style='height: 700px'>
      <a-col :span='6'>
        <a-card style='height: 100%;background-color: #ededed'>
          <a-input-search
            v-model:value='name'
            placeholder='请输入联系人...'
            enter-button
            @search='onSearch'
          />
          <a-tabs v-model:activeKey='chatKey' @change='doChange(chatKey)'>
            <a-tab-pane key='null' tab='全部'>
              <ChatUserPage :listChat='listChat' :onSuccess='onSuccess' :chatKey='chatKey' :searchParams='searchParams'
                            :total='total' @itemClick='uploadItemClick' />
            </a-tab-pane>
            <a-tab-pane key='1' tab='好友'>
              <ChatUserPage :listChat='listChat' :onSuccess='onSuccess' :chatKey='chatKey' :searchParams='searchParams'
                            :total='total' @itemClick='uploadItemClick' />
            </a-tab-pane>
            <a-tab-pane key='0' tab='私信'>
              <ChatUserPage :listChat='listChat' :onSuccess='onSuccess' :chatKey='chatKey' :searchParams='searchParams'
                            :total='total' @itemClick='uploadItemClick' />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <a-col :span='18'>
        <a-result v-if='!chatMessage?.id' title='请选择一个对话，进入聊天' style='margin-top: 200px;'>
          <template #icon>
            <smile-twoTone />
          </template>
        </a-result>
        <a-card
          v-else
          style='height:100% ;'
          :title='chatMessage?.isReceive===0? (chatMessage?.title ?? chatMessage?.targetUserVO.userName)
          : (chatMessage?.receiveTitle ?? chatMessage?.targetUserVO.userName)'>
          <template #extra>
            <a-tag color='green' v-if='oneLineUser?.onlineUsers.length>1'>
              <UserOutlined />
              在线
            </a-tag>
            <a-tag color='#eee' v-else style='color: black'>
              <DisconnectOutlined />
              离线
            </a-tag>
          </template>
          <div class='card-body'>
            <div class='chat-scroll'>
              <a-list item-layout='horizontal' :data-source='historyMessage?.historyMessage.records'>
                <template #renderItem='{ item }'>
                  <a-list-item v-if='item?.sendId===loginUserStore.loginUser.id'>
                    <a-list-item-meta
                      style='display: flex;flex-direction: row-reverse;'
                    >
                      <template #avatar>
                        <a-avatar :src='loginUserStore.loginUser.userAvatar' :size='64' shape='square' />
                      </template>
                      <template #description>
                        <div class='receive'>
                          <div v-if='item.messageType===0'>
                            <a-image :src='item?.url' style='max-height: 220px' />
                          </div>
                          <div v-else-if='item.messageType===1'>
                            <video :src='item?.url' controls playsinline
                                   style='max-height: 220px;width: auto; display: block' />
                          </div>
                          <div v-else-if='item.messageType===2'>
                            <audio  :src='item?.url' controls/>
                          </div>
                          <div v-else>{{ item?.content }}</div>
                        </div>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>

                  <a-list-item v-else>
                    <a-list-item-meta>
                      <template #avatar>
                        <a-avatar :src='chatMessage?.targetUserVO.userAvatar' :size='64' shape='square' />
                      </template>
                      <template #description>
                        <div class='positive' v-if='!item?.url'>{{ item?.content }}</div>
                        <div class='positive' v-else>
                          <a-image v-if='picOrFile===0' :src='item?.url' style='max-height: 220px' />
                          <video v-else :src='item?.url' height='220px' controls />
                        </div>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
            </div>
            <div class='SendMessage'>
              <a-input-group compact>
                <a-input v-model:value='content' placeholder='请输入内容...'
                         style='width: calc(100% - 200px);margin-left: 30px;'>
                  <template #suffix>
                    <a-upload
                      :show-upload-list='false'
                      :custom-request='handleUpload'
                      :before-upload='beforeUpload'
                    >
                      <a-button style='width: 41px;height: 26px;border: none;' @click='updateType(0)'>
                        <PictureOutlined style='font-size: large' />
                      </a-button>
                      <a-button style='width: 41px;height: 26px;border: none;' @click='updateType(1)'>
                        <FileOutlined style='font-size: large;' />
                      </a-button>
                    </a-upload>
                  </template>

                </a-input>
                <a-button type='primary' @click='sendMessage' style=' height: 35.5px;'>
                  <SendOutlined />
                </a-button>
              </a-input-group>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang='ts'>
//初始化 WebSocket 连接，绑定事件
import ChatWebSocket from '../utils/ChatWebSocket'
import { message, UploadProps } from 'ant-design-vue'
import { defineProps, onMounted, onUnmounted, ref, watchEffect, withDefaults } from 'vue'
import { CHAT_MESSAGE_TYPE_ENUM } from '../constants/chat'
import { useLoginuserStore } from '../stores/loginuserStore'
import { getListChatPromptVoUsingPost } from '../api/chatPromptController'
import ChatUserPage from '../components/ChatUserPage.vue'
import {
  SmileTwoTone,
  DisconnectOutlined,
  UserOutlined,
  SendOutlined,
  PictureOutlined,
  FileOutlined
} from '@ant-design/icons-vue'
import { addAudioFileUsingPost } from '../api/audioFileController'

const loginUserStore = useLoginuserStore()
const chatKey = ref('null')
let websocket: ChatWebSocket | null
//搜索的条件
const name = ref('')
const listChat = ref<API.ChatPromptVO[]>([])
const total = ref(0)
//聊天室的id
const chatMessage = ref<API.ChatPromptVO>()
//消息内容
const content = ref('')
//历史消息
const historyMessage = ref()
//在线用户
const oneLineUser = ref()
//0-图片，1-文件，2-音频
const picOrFile = ref<number>(0)

const updateType = (num) => {
  picOrFile.value = num
}

const searchParams = ref<API.ChatPromptQueryDto>({
  current: 1,
  pageSize: 10
})
//tags页的修改
const doChange = async (key) => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser?.id) {
    await loginUserStore.fetchLoginUser()
  }
  const res = await getListChatPromptVoUsingPost({
    ...searchParams.value,
    userId: loginUserStore.loginUser?.id,
    chatType: key,
    isQuery: 0
  })
  if (res.code === 0 && res.data) {
    listChat.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error(res.data)
  }
}
//子组件上传的聊天项
const uploadItemClick = (item) => {
  chatMessage.value = item
}
//上传文件
const handleUpload = async ({ file }: any) => {
  try {
    const res = await addAudioFileUsingPost({
      fileType: picOrFile.value
    }, {}, file)
    if (res.code === 0 && res.data) {
      //发送消息
      if (websocket) {
        websocket.sendMessage({
          type: CHAT_MESSAGE_TYPE_ENUM.SEND,
          messageType: picOrFile.value,
          receiverId: chatMessage.value?.targetUserVO.id,
          targetId: res.data
        })
      }
    } else {
      message.error('上传失败:{}',res.data)
    }
  } catch (e) {
    message.error('上传失败:{}', e.message)
  }
}

//上传前的校验
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // 上传类型：0=图片，1=视频，2=音频
  const type = picOrFile.value
  // 图片校验
  if (type === 0) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('不支持上传图片的格式！仅支持jpg 或 png')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('不能上传超过2M的图片')
    }
    return isJpgOrPng && isLt2M
  }
  // 视频/音频校验
  if (type === 1) {
    // 允许的视频格式
    const isAllowedVideo = [
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ].includes(file.type)

    // 允许的音频格式
    const isAllowedAudio = [
      'audio/mpeg',   // MP3
      'audio/wav',    // WAV
      'audio/ogg',    // OGG
    ].includes(file.type)

    //不是视频格式，判断是否为音频
    if (!isAllowedVideo && !isAllowedAudio) {
      message.error('上传格式有误')
    }
    //是视频格式的数据
    if (isAllowedVideo) {
      // 视频大小限制（200MB）
      const isLt200M = file.size / 1024 / 1024 < 200
      if (!isLt200M) {
        message.error('不能上传超过200MB的视频')
      }
      return isAllowedVideo && isLt200M
    } else { //是音频格式的数据
      // 音频大小限制（20MB）
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        message.error('不能上传超过20MB的音频')
      }
      picOrFile.value = 2
      return isAllowedAudio && isLt20M
    }
  }
}

//子组件成功的回调
  const onSuccess = (chatKey) => {
    doChange(chatKey)
  }
//todo 修改反向的title receiveTitle
  const onSearch = () => {
    searchParams.value.title = name.value
    doChange('null')
  }

  onMounted(() => {
    doChange('null')
  })
//发送消息
  const sendMessage = () => {
    if (websocket) {
      websocket.sendMessage({
        type: CHAT_MESSAGE_TYPE_ENUM.SEND,
        content: content.value,
        receiverId: chatMessage.value?.targetUserVO.id
      })
    }
    content.value = ''
  }

//监听是否创建websocket连接
  watchEffect(() => {
    if (chatMessage.value?.id) {
      initWebSocket()
    }
    chatMessage.value
    // historyMessage.value
  })
//断开websocket连接
  onUnmounted(() => {
    if (websocket) {
      websocket.disconnect()
    }
  })

  const initWebSocket = () => {
    if (!chatMessage.value?.id) {
      return
    }
    //防止websocket未被释放
    if (websocket) {
      websocket.disconnect()
    }
    //创建webSocket实例
    websocket = new ChatWebSocket(chatMessage.value.id)
    //建立 webSocket 连接
    websocket.connect()
    //监听消息
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.JOIN, (msg: any) => {
      console.log('收到消息:', msg)
    })

    //监听错误
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.ERROR, (msg: any) => {
      console.error('收到错误消息123:', msg)
    })

    //监听收到历史消息状态
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.HISTORY, (msg: any) => {
      console.log('收到历史消息123:', msg)
      historyMessage.value = msg
      console.log('historyMessage', historyMessage.value)
    })

    //监听在线用户
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.ONLINEUSER, (msg: any) => {
      console.log('获取在线用户123', msg)
      oneLineUser.value = msg
      console.log('oneLineUser：', oneLineUser.value)
    })

    //监听退出编辑状态
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.EXIT, (msg: any) => {
      console.log('收到退出123')
    })

    //监听发送消息
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.SEND, (msg: any) => {
      console.log('收到发送之后的消息后的历史数据:', msg)
      historyMessage.value = msg
      message.info(msg.message)
    })
  }


</script>


<style scoped>
#chat {
}

.SendMessage {
  padding-top: 16px;
  width: 100%;
  border-top: 1px solid #d2cfcf;
}

.receive {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 16px;
  min-height: 64px;
  padding-right: 22px;
  align-items: center;
  background-color: rgb(236 227 227 / 30%);
  border-radius: 35px;
  color: black;
}

.positive {
  display: flex;
  margin-left: 16px;
  min-height: 64px;
  padding-left: 22px;
  align-items: center;
  background-color: rgb(236 227 227 / 30%);
  border-radius: 35px;
  color: black;
}

.chat-scroll {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

/*优化滚动条样式的*/
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.card-body {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 650px;
}
</style>

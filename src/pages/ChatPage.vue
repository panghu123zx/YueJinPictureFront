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
        <a-card v-else style='height: 100%'
                :title='chatMessage?.isReceive===0? (chatMessage?.title ?? chatMessage?.targetUserVO.userName)
                : (chatMessage?.receiveTitle ?? chatMessage?.targetUserVO.userName)'>

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
                    <div class='receive'>{{ item?.content }}</div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item v-else>
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar :src='chatMessage?.targetUserVO.userAvatar' :size='64' shape='square' />
                  </template>
                  <template #description>
                    <div class='positive'>{{ item?.content }}</div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>


          <div>
            <div class='SendMessage'>
              <a-divider style='background-color: #996a72; margin-left: -42px;' />
              <a-input-group compact>
                <a-input v-model:value='content' style='width: calc(100% - 200px)' />
                <a-button type='primary' @click='sendMessage'>发送</a-button>
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
import { message } from 'ant-design-vue'
import { defineProps, onMounted, onUnmounted, ref, watchEffect, withDefaults } from 'vue'
import { CHAT_MESSAGE_TYPE_ENUM } from '../constants/chat'
import { useLoginuserStore } from '../stores/loginuserStore'
import { getListChatPromptVoUsingPost } from '../api/chatPromptController'
import ChatUserPage from '../components/ChatUserPage.vue'
import { SmileTwoTone } from '@ant-design/icons-vue'

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

const historyMessage = ref()
const oneLineUser = ref()


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
  content.value=''
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
      console.log('收到消息123:', msg)
      message.info(msg.message)
    })

    //监听错误
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.ERROR, (msg: any) => {
      console.error('收到错误消息123:', msg)
      message.error(msg.message)
    })

    //监听进入发送消息状态
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.HISTORY, (msg: any) => {
      console.log('收到历史消息123:', msg)
      historyMessage.value = msg
      console.log('historyMessage', historyMessage.value)
      message.info(msg.message)
    })

    //监听退出编辑状态
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.ONLINEUSER, (msg: any) => {
      console.log('获取在线用户123', msg)
      oneLineUser.value = msg
      console.log('oneLineUser', oneLineUser.value)
      message.info(msg.message)
    })

    //监听退出编辑状态
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.EXIT, (msg: any) => {
      console.log('收到退出123')
      message.info(msg.message)
    })

    //监听发送消息
    websocket.on(CHAT_MESSAGE_TYPE_ENUM.SEND, (msg: any) => {
      console.log('收到编辑操作消息123:', msg)
      historyMessage.value = msg
      message.info(msg.message)
    })
  }


</script>


<style scoped>
#chat {
}

.SendMessage {
  position: absolute;
  bottom: 20px;
  left: 85px;
  width: 90%;

}

.receive {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 16px;
  min-height: 64px;
  padding-right: 22px;
  align-items: center;
  background-color: rgb(236 218 218 / 50%);
  border-radius: 35px;
  color: black;
}

.positive {
  display: flex;
  margin-left: 16px;
  min-height: 64px;
  padding-left: 22px;
  align-items: center;
  background-color: rgb(236 218 218 / 50%);
  border-radius: 35px;
  color: black;
}
</style>

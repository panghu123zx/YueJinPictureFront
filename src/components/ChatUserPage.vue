<template>
  <a-list item-layout='horizontal' :data-source='listChat'>
    <template #renderItem='{ item }'>
      <a-list-item @click='uploadItemClick(item)' style='padding-left: 0px'>
        <a-list-item-meta
          :description='item?.lastMessage  ?? " " '
        >
          <template #title>
            {{item.isReceive===0? (item?.title ?? item?.targetUserVO?.userName) :(item.receiveTitle ?? item?.targetUserVO?.userName) }}
          </template>
          <template #avatar>
            <a-avatar :src='item?.targetUserVO?.userAvatar' />
          </template>
        </a-list-item-meta>
        <div style='margin-right: -30px;'>{{dayjs(item?.lastMessageTime).format("HH:mm") ?? " "   }}</div>
        <template #actions>
          <a-dropdown :trigger="['click']">
            <MoreOutlined />
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click='showModal'>
                    <EditOutlined />
                    修改备注
                    <a-modal v-model:open='open' title='修改备注' @ok='handleOk(item)'>
                      <a-input v-model:value='remark' placeholder='请输入备注' />
                    </a-modal>
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click='doDelete(item)' style='color: red'>
                    <DeleteOutlined style='color: red' />
                    删除聊天
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>

        </template>
      </a-list-item>
    </template>
  </a-list>
  <!--    分页插件-->
  <a-pagination style='text-align: right;'
                v-model:current='searchParams.current'
                :total='total'
                v-model:pageSize='searchParams.pageSize'
                :onChange='doChangePages' />
</template>

<script setup lang='ts'>
import { cleanChatPromptUsingPost, updateChatPromptUsingPost } from '../api/chatPromptController'
import { message } from 'ant-design-vue'
import { defineEmits, defineProps, ref } from 'vue'
import { MoreOutlined,  EditOutlined ,DeleteOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

interface Props{
  listChat: API.ChatPromptVO[],
  chatKey: string,
  onSuccess:(chatKey)=> void,
  searchParams: API.ChatPromptQueryDto,
  total: number,
}

const props=defineProps<Props>()
const emit= defineEmits(['itemClick'])


const open = ref<boolean>(false);
const remark=ref()

const showModal = () => {
  open.value = true;
};

//点击的时候，向父组件传递聊天室的数据，并清空未读消息数
const uploadItemClick=async (item)=>{
  emit('itemClick',item)
  const res=await cleanChatPromptUsingPost({
    id: item?.id,
  })
  if(res.code!==0){
    message.error(res.data)
  }
}


const handleOk = async (item,e: MouseEvent) => {
  open.value = false;
  //是否反向
  const receive= item?.isReceive
  const params={
    id: item?.id,
    userId:item.userId,
    targetId: item?.targetId,
  }as API.ChatPromptQueryDto
  if(receive==0){
    params.title=remark.value
  }else{
    params.receiveTitle=remark.value
  }
  const res=await updateChatPromptUsingPost({
    ...params
  })
  if(res.data &&res.code===0){
    props.onSuccess(props.chatKey)
  }else{
    message.error('修改失败')
  }
}

//图片的分页
const doChangePages = (page, pageSize) => {
  props.searchParams.current = page
  props.searchParams.pageSize = pageSize
  props.onSuccess(props.chatKey)
}

const doDelete=async (item)=>{

}
</script>
<style scoped>
#chat {
}
:deep(.ant-list .ant-list-item) {
  padding-left: 0;
}

:deep(.ant-list-item-meta-description ){
  max-height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

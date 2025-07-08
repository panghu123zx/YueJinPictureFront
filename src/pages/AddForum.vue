<template>
  <div id='addforum'>
    <a-form
      :model='forumData'
      name='basic'
      layout='vertical'
      autocomplete='off'
      @finish='onFinish'
      @finishFailed='onFinishFailed'
    >
      <a-form-item
        label='标题'
        name='title'
        :rules="[{ required: true, message: '请输入标题...' }]"
      >
        <a-input v-model:value='forumData.title' placeholder='请输入标题....' />
      </a-form-item>

      <a-form-item
        label='分类'
        name='category'
        :rules="[{ required: true, message: '请输入分类...' }]"
      >
        <a-select
          v-model:value='forumData.category'
          placeholder='请输入分类'
          allow-clear
        >
          <a-select-option v-for='cat in categoryList' :key='cat'>{{ cat }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label='内容'
        name='content'
        :rules="[{ required: true, message: '请输入内容...' }]"
      >
        <div style='border: 1px solid #ccc'>
          <Toolbar
            style='border-bottom: 1px solid #ccc'
            :editor='editorRef'
            :defaultConfig='toolbarConfig'
            :mode='mode'
          />
          <Editor
            style='height: 400px; overflow-y: hidden;'
            v-model='forumData.content'
            :defaultConfig='editorConfig'
            :mode='mode'
            @onCreated='handleCreated'
          />
        </div>
      </a-form-item>

      <a-form-item :wrapper-col='{ offset: 8, span: 16 }'>
        <a-button type='primary' html-type='submit' @click='doSubmit'>发布</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang='ts' setup>
import {
  addForumFileUrlUsingPost,
  addForumFileUsingPost,
  addForumUsingPost, deleteForumFileUsingPost, getForumVoUsingGet,
  listForumCategoryUsingGet, updateForumUsingPost
} from '../api/forumController'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, computed } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { createEditor } from '@wangeditor/editor'
import Forum = API.Forum
import ForumVO = API.ForumVO

const router = useRouter()
const route = useRoute()
const forumData = ref<ForumVO>({
  title: '',
  category: '',
  content: ''
})
const mode = 'default'

const forumId = computed(() => {
  return route.query?.id
})

//帖子图片id
const forumFileId = ref([])
//帖子图片url和id对应
const forumFileUrl = ref({})
//分类
const categoryList = ref([])

//用于存储图片URL和排序值的映射
const imageSortMap = ref({})
//文件排序
const fileSort = ref(0)

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()


const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      //自定义上传
      //todo 实现上传网络图片
      async customUpload(file: File, insertFn: any) {
        let htmlContent = editorRef.value?.getHtml() || ''
        // 将HTML中的图片标记转换为纯文本标记
        htmlContent = htmlContent
          .replace(/<img[^>]*>/g, ' ')
          .replace(/<p>/g, '')
          .replace(/<\/p>/g, '\n')
          .replace(/\n\n+/g, '\n\n')
          .trim()
        if (file.size > 1024 * 1024 * 5) {
          message.error('图片大小不能超过5M')
          return
        }
        //上传
        const res = await addForumFileUsingPost({
          type: 0,
          position: htmlContent.length + 1,
          sort: fileSort.value
        }, {}, file)
        if (res.code === 0) {
          const id = res.data.id
          forumFileId.value.push(id)
          imageSortMap.value[res.data.picUrl] = fileSort.value  //将图片URL和排序值存储到映射中
          fileSort.value++  //每次上传完图片后，文件排序+1
          //图片url和id对应，用于后续的删除
          forumFileUrl.value[res.data.picUrl] = id
          insertFn(res.data.picUrl)
        } else {
          message.error('上传失败')
        }
      }
    },
    //图片删除
    deleteImage: {
      async customAlertAndDelete(imageNode) {
        if (!imageNode || !imageNode.src) return
        //得到图片的url
        const url = imageNode.src
        //得到排序字段
        const sort = imageSortMap.value[url]
        if (sort == null) return
        //得到图片的id
        const fileId = forumFileUrl.value[url]
        //删除图片
        const res = await deleteForumFileUsingPost({
          id: fileId as any
        })
        if (res.code === 0) {
          //删除图片id，防止和帖子表关联
          const index = forumFileId.value.indexOf(fileId)
          if (index > -1) {
            forumFileId.value.splice(index, 1)
          }
          //删除url和sort的映射
          delete imageSortMap.value[url]
        } else {
          message.error('删除失败')
        }
      }
    }
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
// 初始化操作
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  editor.handleTab = () => editor.insertText('    ')


}

//提交
const doSubmit = async () => {
  //获取内容
  let htmlContent = editorRef.value?.getHtml() || ''
  //图片的处理
  htmlContent = htmlContent.replace(/<img[^>]*src="([^"]+)"[^>]*>/g, (match, src) => {
    const sortVal = imageSortMap.value[src] !== undefined ? imageSortMap.value[src] : fileSort.value
    return `\n{img-${sortVal}}\n`
  })

  // 将HTML中的图片标记转换为纯文本标记
  htmlContent = htmlContent
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/\n\n+/g, '\n\n')
    .trim()
  let res = null
  if (forumId.value) {
    res = await updateForumUsingPost({
      ...forumData.value,
      id: forumId.value,
      content: htmlContent,
      listForumFileId: forumFileId.value
    })
  } else {
    res = await addForumUsingPost({
      ...forumData.value,
      content: htmlContent,
      listForumFileId: forumFileId.value
    })
  }

  if (res.code === 0) {
    message.success('帖子创建成功')
    router.push('/forum')
  } else {
    message.error('帖子创建失败')
  }
}
//获取分类
const getCategoryList = async () => {
  const res = await listForumCategoryUsingGet()
  if (res.code === 0) {
    categoryList.value = res.data.categoryList
  } else {
    message.error('获取分类列表失败')
  }
}
//获取老数据
const getOldForum = async () => {
  if (forumId.value) {
    const res = await getForumVoUsingGet({
      id: forumId.value as any
    })
    if (res.code === 0) {
      //处理获取的图片数据
      const forumFile = res.data.forumFile
      const processedContent = res.data.content.replace(/{img-(\d+)}/g, (match, sortIndex) => {
        const image = forumFile.find(file => file.sort === Number(sortIndex))
        return image ? `<img src='${image?.picUrl}' data-sort='${sortIndex}' style='max-height: 300px'/>` : '图片未找到'
      })

      forumData.value.title = res.data.title
      forumData.value.content = processedContent
      forumData.value.category = res.data.category
      //设置url和排序值一一对应
      forumFile.forEach(file => {
        imageSortMap.value[file.picUrl] = fileSort.value
        fileSort.value++
        //图片id
        forumFileId.value.push(file.id)
      })

      const editor = editorRef.value
      editor.setHtml(processedContent)
    }
  }

}


onMounted(() => {
  getCategoryList()
  getOldForum()
})

</script>

<style scoped>
#addforum {
  max-width: 1280px;
  margin: 0 auto;
}
</style>

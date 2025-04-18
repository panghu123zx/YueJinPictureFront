import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import MySpacePage from '../pages/MySpacePage.vue'
import AddPicture from '../pages/AddPicture.vue'
import AddPictureBatch from '../pages/AddPictureBatch.vue'
import AddSpacePage from '../pages/AddSpacePage.vue'
import PictureDetailPage from '../pages/PictureDetailPage.vue'
import MyHomePage from '../pages/MyHomePage.vue'
import MyUploadPage from '../pages/MyUploadPage.vue'
import SpaceDetailPage from '../pages/SpaceDetailPage.vue'
import SpaceAnalyzePage from '../pages/SpaceAnalyzePage.vue'
import SpaceUserManagerPage from '../pages/SpaceUserManagerPage.vue'
import ImageByPictureSearch from '../pages/ImageByPictureSearch.vue'
// import MyLikeSharePic from '../pages/MyLikeSharePic.vue'
import UserLoginPage from '../pages/user/UserLoginPage.vue'
import UserRegisterPage from '../pages/user/UserRegisterPage.vue'
import UserManagerPage from '../pages/admin/UserManagerPage.vue'
import SpaceManagerPage from '../pages/admin/SpaceManagerPage.vue'
import PictureManagerPage from '../pages/admin/PictureManagerPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/space',
      name: 'myspace',
      component: MySpacePage
    },
    {
      path: '/user/login',
      name: 'login',
      component: UserLoginPage
    },
    {
      path: '/user/register',
      name: 'register',
      component: UserRegisterPage
    },
    {
      path: '/addpicture',
      name: 'addPicture',
      component: AddPicture
    },
    {
      path: '/addpicture/batch',
      name: 'addPictureBatch',
      component: AddPictureBatch
    },
    {
      path: '/addspace',
      name: 'addspace',
      component: AddSpacePage
    },
    {
      path: '/imagesearch',
      name: 'imagesearch',
      component: ImageByPictureSearch
    },
    {
      path: '/my',
      name: 'my',
      component: MyHomePage
    },
    {
      path: '/myupload',
      name: 'myupload',
      component: MyUploadPage
    },
    {
      path: '/picture/:id',
      name: 'picturedetail',
      component: PictureDetailPage,
      props: true
    },
    {
      path: '/space/:id',
      name: 'spacedetail',
      component: SpaceDetailPage,
      props: true
    },
    {
      path: '/admin/usermanager',
      name: 'userManager',
      component: UserManagerPage
    },
    {
      path: '/admin/picturemanager',
      name: 'pictureManager',
      component: PictureManagerPage
    },
    {
      path: '/admin/spacemanager',
      name: 'spaceManager',
      component: SpaceManagerPage
    },
    {
      path: '/space_analyze',
      name: 'spaceAnalyze',
      component: SpaceAnalyzePage
    },
    // {
    //   path: '/likesharepic',
    //   name: 'likesharepic',
    //   component: MyLikeSharePic
    // },
    {
      path: '/spaceUserManage/:id',
      name: 'spaceUserManage',
      component: SpaceUserManagerPage,
      props: true
    },

  ]
})

export default router

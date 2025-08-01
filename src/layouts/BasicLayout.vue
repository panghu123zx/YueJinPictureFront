<template>
  <div id='BasicLayout'>
    <a-layout style='min-height: 100vh'>
      <a-layout-header class='header'>
        <GlobalHeader />
      </a-layout-header>
      <a-layout>
        <GlobalSide class='sider'/>
        <a-layout-content class='center'>
          <router-view />
        </a-layout-content>
      </a-layout>
      <a-layout-footer class='footer'>
        <a href='https://github.com/panghu123zx' target='_blank' style='color: #aba5a5'>跃金图库 by 胖虎</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang='ts'>
import GlobalHeader from '../components/GlobalHeader.vue'
import GlobalSide from '../components/GlobalSide.vue'



</script>

<style scoped>
#BasicLayout .footer {
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #efefef;
}

.center {
  padding: 22px;
  margin-bottom: 28px;
  background: linear-gradient(to, right, #fefefe, #fff);
}
.sider{
  background: #fff;
  padding-top: 20px;
  border-right: 0.5px solid #eee;
}

.header {
  margin-bottom: 0px;
  padding-inline: 20px;
  color: unset;
  background-color: white;
}

#BasicLayout :deep(.ant-menu-root){
  border-bottom: none !important;
  border-inline-end: none !important;
}
</style>

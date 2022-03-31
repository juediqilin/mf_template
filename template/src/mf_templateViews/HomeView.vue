<template>
  <div class="home">
    <img alt="Ve logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <el-button v-btn type="primary">按钮</el-button>
    <el-button type="primary">{{i18n.t('header')}}</el-button>
  </div>
</template>

<script setup>
// @ is an alias to /src
import { defineAsyncComponent, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
const HelloWorld = defineAsyncComponent(() => import('@/components/HelloWorld.vue'))
// 当前组件实例
const { proxy } = getCurrentInstance()
console.log(proxy)

// 国际化
const i18n = useI18n()
console.log(i18n)
</script>

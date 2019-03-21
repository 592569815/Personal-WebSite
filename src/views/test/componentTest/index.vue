<template>
  <div class="component-container">
    <p>{{ time }}</p>
    <el-row>
      <el-button v-repeatClick="methods1">默认按钮</el-button>
      <el-button type="primary" @click.native="methods1">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
  </div>
</template>

<script>
import repeatClick from '@/directive/repeat-click/index.js'
import { parseTime, formatTime } from '@/utils'
export default {
  name: 'ComponentTest',
  directives: {
    repeatClick
  },
  data() {
    return {
      test: '测试',
      time: formatTime()
    }
  },
  computed: {
    parseTime,
    formatTime
  },
  methods: {
    methods1() {
      console.log(666)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.component-container{
  padding: 5px;
}
</style>

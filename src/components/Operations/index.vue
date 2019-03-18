<template>
  <div v-if="limitList && limitList.length > 0" class="toolbar clearfix">
    <template>
      <div v-for="btn in limitList" :key="btn.name">
        <!-- 下拉框 -->
        <el-select
          v-if="btn.type === 'select'"
          v-model="selectAction"
          :placeholder="btn.name"
          :style="{width: btn.width+'px'}"
          :class="btn.float"
          size="small">
          <el-option
            v-for="item in btn.children"
            :key="item.name"
            :label="item.name"
            :value="item.action"
            :disabled="item.disabled"
            @click.native="selectItem">
          </el-option>
        </el-select>
        <!-- 按钮 -->
        <el-button
          v-if="!btn.type"
          :style="{width: btn.width+'px'}"
          :type="btn.type"
          :class="btn.float"
          size="mini"
          @click.native="handleClick(btn)">
          {{ btn.name }}
        </el-button>
      </div>
    </template>
  </div>
</template>
<script type="text/babel">
import index from './index.js'
export default {
  ...index
}
</script>

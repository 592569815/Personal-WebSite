<template>
  <div v-if="limitList && limitList.length > 0" class="toolbar clearfix">
    <template v-for="btn in limitList">
      <!-- 下拉框 -->
      <el-select
        v-if="btn.type === 'select'"
        v-model="selectAction"
        :key="btn.name"
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
        v-waves
        v-if="!btn.type"
        :key="btn.name"
        :style="{ width: btn.width + 'px' }"
        :type="btn.type"
        :class="btn.float"
        size="mini"
        @click.native="handleClick(btn)">
        {{ btn.name }}
      </el-button>
    </template>
  </div>
</template>
<script>
import index from './index.js'
import waves from '@/directive/waves'
export default {
  directives: { waves },
  ...index
}
</script>

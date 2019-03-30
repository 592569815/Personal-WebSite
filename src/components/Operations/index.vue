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

<style lang="scss">
/*操作组件开始*/
.toolbar {
  margin-bottom: 10px;
  min-height: 40px;
  background: #fff;
  border: 1px solid #ebebeb;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.2);
  border-radius: 3px;
  padding: 8px 10px 0;
  // display: flex;
  // align-items: center;
  .el-button {
    color: #5E6DB3;
    border-color: #5E6DB3;
    border-radius: 2px;
    width: 60px;
    &.fr {
      float: right;
      margin-left: 10px;
    }
  }
  .el-button:hover {
    background-color: #ebf3ff;
  }
  .el-button--mini {
    padding: 5px 0px;
  }
  .el-select {
    width: 100px;
    height: 24px;
    margin-right: 10px;
    .el-input {
      input::-webkit-input-placeholder {
        color: #5E6DB3;
      }
      input:-moz-placeholder {
        color:#5E6DB3;
      }
      input::-moz-placeholder {
        color:#5E6DB3;
      }
      input:-ms-input-placeholder {
        color:#5E6DB3;
      }
    }
    .el-input__inner {
      background: #FFFFFF;
      height: 24px;
      line-height: 22px;
      border: 1px solid #5E6DB3;
      border-radius: 2px;
      padding: 0 7px;
      font-size: 12px;
      color: #5E6DB3;
      &:hover {
        background-color: #ebf3ff;
      }
    }
    .el-input__suffix {
      right: 0;
      .el-input__icon {
        color: #5E6DB3;
        font-size: 12px;
        line-height: 24px;
      }
    }
  }
}
/*操作组件结束*/
</style>

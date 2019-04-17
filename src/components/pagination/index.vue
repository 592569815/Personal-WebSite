<!-- 分页组件 -->
<template>
  <div v-if="total > 0" :style="{'left': positionLeft + 'px'}" class="pagination_box">
    <el-pagination
      :pager-count="pagerCount"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :current-page="currentPage"
      layout="slot, prev"
      class="part_one br_n"
      size="mini"
      prev-text="上一页"
      @current-change="currentChange">
      <div class="first_page">
        <select v-model="pageSizesVal" @change="sizeChange">
          <option v-for="item in pageSizes" :value="item" :key="item">
            {{ item }}
          </option>
        </select>
        <button :disabled="currentPage === 1" @click="toFirstPage" >首页</button>
      </div>
    </el-pagination>
    <el-pagination
      :pager-count="pagerCount"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :current-page="currentPage"
      class="part_two bd_n"
      size="mini"
      layout="pager, next, slot"
      next-text="下一页"
      @current-change="currentChange">
      <div class="operate">
        <button :disabled="currentPage === totalPage" class="last_page" @click="toLastPage">末页</button>
        <div class="page_total">{{ currentPage }}/{{ totalPage }}</div>
        <div class="page_total total">{{ total }}</div>
        <div class="empty"></div>
        <input v-model="toPage" type="text">
        <button @click="toTargetPage">go</button>
        <div class="to_top" @click="backTop">
          <svg-icon icon-class="goTop" />
        </div>
      </div>
    </el-pagination>
  </div>
</template>

<style lang="scss" scoped>
/*分页组件开始*/
.pagination_box {
  position: fixed;
  right: 20px;
  bottom: 0;
  display: flex;
  height: 50px;
  padding-top: 10px;
  justify-content: flex-end;
  background-color: #fff;
  z-index: 999;
  transition: all 0.2s linear;
  border-top: 1px solid #ccc;
  .el-pagination {
    padding: 0;
    margin: 0;
    height: 30px;
    display: flex;
    align-items: center;
    overflow: hidden;
    border: 1px solid #DFE3E9;
    font-weight: normal;
    &.br_n {
      border-right: none;
    }
    &.bd_n {
      border: none;
    }
    &.part_one {
      background: #fff;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      .first_page {
        display: flex;
        height: 100%;
        select {
          width: 50px;
          outline:none;
          height: 100%;
          border: none;
          font-size: 12px;
          color: #252525;
        }
        button {
          width: 50px;
          border-left: 1px solid #DFE3E9;
          border-right: 1px solid #DFE3E9;
        }
      }
      button {
        width: 60px;
        font-size: 14px;
        padding: 0;
        span {
          font-size: 14px;
        }
      }
    }
    &.part_two {
      margin-right: 18px;
      .el-pager {
        border: 1px solid #DFE3E9;
        border-right: none;
        background-color: #fff;
        li {
          width: 44px;
          font-size: 14px;
          color: #282F36;
          border-right: 1px solid #DFE3E9;
          &.active {
            color: $menuActiveText;
          }
          &:hover {
            color: $menuActiveText;
          }
        }
      }
      button {
        height: 30px;
        width: 60px;
        padding: 0;
        border: 1px solid #DFE3E9;
        border-left: none;
        background-color: #fff;
        span {
          font-size: 14px;
        }
      }
      .operate {
        display: flex;
        align-items: center;
        .last_page {
          width: 50px;
          font-size: 14px;
          overflow: hidden;
          cursor: pointer;
          &：hover {
            color: #5E6DB3!important;
          }
        }
        .page_total {
          min-width: 40px;
          height: 30px;
          line-height: 28px;
          text-align: center;
          font-size: 14px;
          border: 1px solid #DFE3E9;
          border-left: none;
          padding: 0 5px;
        }
        .total {
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
        }
        .empty {
          height: 30px;
          width: 18px;
          background-color: #fff;
        }
        input {
          width: 50px;
          height: 30px;
          outline: none;
          border: 1px solid #DFE3E9;
          font-size: 14px;
          color: #252525;
          padding-left: 5px!important;
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
        }
        button {
          cursor: pointer;
          width: 40px;
          height: 30px;
          font-size: 14px;
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
        }
        .to_top {
          display: inline-block;
          height: 30px;
          width: 30px;
          line-height: 30px;
          text-align: center;
          color: #252525;
          cursor: pointer;
          background: #eee;
          border: 1px solid #DFE3E9;
          border-radius: 4px 2px 2px 4px;
        }
      }
    }
  }
}
/*分页组件结束*/
</style>

<script type="text/babel">
import index from './index.js'
export default {
  ...index
}
</script>


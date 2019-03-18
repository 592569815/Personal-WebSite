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

</style>

<script type="text/babel">
import index from './index.js'
export default {
  ...index
}
</script>

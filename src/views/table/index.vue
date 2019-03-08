<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.keyword" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column :label="$t('table.en')" align="center" >
        <template slot-scope="scope">
          {{ scope.row.en }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.cn')">
        <template slot-scope="scope">
          {{ scope.row.cn }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.code')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { getAllCountry } from '@/api/table'
import Sticky from '@/components/Sticky'
import waves from '@/directive/waves' // wave 指令

export default {
  components: { Sticky },
  directives: { waves },
  // 组件内过滤器
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null, // 列表数据
      listLoading: true, // 加载动画
      totalCount: 0, // 数据总个数
      listQuery: { // 列表请求参数
        keyword: undefined
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getAllCountry(this.listQuery).then(response => {
        this.list = response.data.dataList
        this.totalCount = response.data.dataMeta.totalCount
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        console.log(error)
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    }
  }
}
</script>

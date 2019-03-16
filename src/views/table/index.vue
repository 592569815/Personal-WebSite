<template>
  <div class="app-container">
    <PageSearch
      slot="search-form"
      ref="search"
      v-model="query"
      :reset-form="initQuery"
      :default-form="defaultQuery"
      @search="search"
      @cleanSearchItem="cleanSearchItem"
      @cleanSearchAll="cleanSearchAll">
    </PageSearch>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column :label="$t('table.code')" align="center" >
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.en')">
        <template slot-scope="scope">
          {{ scope.row.en }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.cn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cn }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pg-pagination
      slot="pagination"
      :current-page="pageIndex"
      :page-size="pageSize"
      :total="total"
      @size-change="sizeChange"
      @current-change="currentChange">
    </pg-pagination>
  </div>
</template>

<script>
import { getAllCountry } from '@/api/table'
import { cloneDeep } from 'lodash'
import Sticky from '@/components/Sticky'
import waves from '@/directive/waves' // wave 指令

export default {
  components: { Sticky },
  directives: { waves },
  data() {
    return {
      // 搜索数据
      query: {
        keyword: '',
        searchType: 'code' // 下拉按钮组默认展示的选项
      },
      // 搜索数据（默认）
      initQuery: {
        keyword: '',
        searchType: 'code' // 下拉按钮组默认展示的选项
      },
      pageIndex: 1, // 当前页数
      pageSize: 20, // 一页的总数据
      conditions: [], // 调用接口时传递的参数数组
      list: null, // 列表数据
      listLoading: true, // 加载动画
      total: 0 // 数据总个数
    }
  },
  computed: {
    // 配置筛选菜单
    defaultQuery: {
      get() {
        return [
          {
            type: 'group',
            text: 'text',
            value: 'value',
            selectModel: 'searchType',
            selectLabel: '搜索类型',
            inputModel: 'keyword',
            inputLabel: '关键字',
            options: [
              {
                value: 'code',
                text: '国家简码'
              },
              {
                value: 'countryEn',
                text: '国家名称(英)'
              },
              {
                value: 'countryCn',
                text: '国家名称(中)'
              }
            ]
          }
        ]
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
      getAllCountry(this.pageIndex, this.pageSize, this.conditions).then(response => {
        this.list = response.data.dataList
        this.total = response.data.dataMeta.totalCount
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        console.log(error)
      })
    },
    // 生成搜索条件
    buildConditionsData() {
      this.conditions = []
      Object.keys(this.query).forEach((key) => {
        if (key === 'keyword') {
          this.conditions.push({
            name: 'keyword',
            value: this.query[key]
          })
        } else if (key === 'time') {
          if (this.query[key] && this.query[key].length === 2) {
            this.conditions.push({
              name: 'datetimeType',
              value: this.query['datetimeType']
            })
          }
        } else if (key === 'dateBegin' || key === 'dateEnd') {
          this.conditions.push({
            name: key,
            value: this.query[key]
          })
        } else {
          this.conditions.push({
            name: key,
            value: this.query[key]
          })
        }
      })
    },
    // 搜索
    search() {
      this.pageIndex = 1
      this.update()
    },
    // 更新数据
    update() {
      this.buildConditionsData()
      this.fetchData()
    },
    // 清除单项
    cleanSearchItem(model) {
      console.log('model', model)
      this.query[model] = cloneDeep(this.initQuery[model])
    },
    // 清除全部
    cleanSearchAll() {
      this.query = cloneDeep(this.initQuery)
      this.conditions = []
    },
    // 分页数更改
    sizeChange(size) {
      this.pageSize = size
      this.pageIndex = 1
      this.update()
    },
    // 页码更新触发
    currentChange(current) {
      this.pageIndex = current
      this.update()
    }
  }
}
</script>

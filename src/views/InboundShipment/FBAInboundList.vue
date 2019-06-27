<template>
  <div class="app-container">
    {{message}}
  </div>
</template>

<script>
import { getList } from '@/api/InboundShipment'
export default {
  name: 'FBAInboundList',
  data() {
    return {
      message: 'hello vue',
      listLoading: false,
      pageIndex: 1,
      pageSize: 50,
      conditions: [],
      list: [],
      total: 0
    }
  },
  methods: {
    fetchData () {
      this.listLoading = true
      getList(this.pageIndex, this.pageSize, this.conditions).then(()=>{
        this.list = response.data.dataList
        this.total = response.data.dataMeta.totalCount
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        console.log(error)
      })
   }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>

</style>


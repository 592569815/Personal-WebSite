import { mapGetters } from 'vuex'

export default {
  name: 'PgPagination',
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100, 200]
      }
    },
    pageSize: {
      type: Number,
      default: 20
    },
    layout: {
      type: String,
      default: 'sizes, slot, prev, pager, next, slot, jumper'
    },
    total: {
      type: Number,
      default: 0
    },
    positionData: {
      type: Object,
      default() {
        return {
          min: 66,
          max: 180
        }
      }
    },
    isEditPage: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // isCollapse(newVal) {
    //   if (newVal) {
    //     this.positionLeft = this.positionData.min
    //   } else {
    //     this.positionLeft = this.positionData.max
    //   }
    // }
  },
  computed: {
    // ...mapGetters([
    //   'isCollapse'
    // ]),
    pageSizesVal: {
      get() {
        return this.pageSize
      },
      set(newVal) {
      }
    },
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  data() {
    return {
      pagerCount: 5,
      toPage: '',
      positionLeft: 190
    }
  },
  mounted() {
    // this.positionLeft = this.isCollapse ? this.positionData.min : this.positionData.max
  },
  methods: {
    // 页码改变
    currentChange(currentPage) {
      this.$emit('current-change', currentPage)
    },
    // 页容量改变
    sizeChange($event) {
      this.$emit('size-change', $event.target.value - 0)
    },
    // 首页
    toFirstPage() {
      if (this.currentPage === 1) {
        return
      }
      this.currentChange(1)
    },
    // 末页
    toLastPage() {
      if (this.currentPage === Math.ceil(this.total / this.pageSize)) {
        return
      }
      this.currentChange(Math.ceil(this.total / this.pageSize))
    },
    // 跳转到目标页
    toTargetPage() {
      if (this.toPage.trim() && !isNaN(this.toPage - 0) && this.toPage !== 0 && this.toPage <= Math.ceil(this.total / this.pageSize)) {
        this.currentChange(this.toPage - 0)
      }
    },
    // 返回顶部
    backTop() {
      if (this.isEditPage) {
        this.$emit('back-top')
      } else {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      }
    }
  }
}

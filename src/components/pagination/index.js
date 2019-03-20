import { mapGetters } from 'vuex'
import { scrollTo } from '@/utils/scrollTo'

export default {
  name: 'PgPagination',
  props: {
    // 当前页，默认第一页
    currentPage: {
      type: Number,
      default: 1
    },
    // 可配置一页数据量
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100, 200]
      }
    },
    // 默认一页20条数据
    pageSize: {
      type: Number,
      default: 20
    },
    // 布局
    layout: {
      type: String,
      default: 'sizes, slot, prev, pager, next, slot, jumper'
    },
    // 数据总数
    total: {
      type: Number,
      default: 0
    },
    // 是否自动滚动到顶部 默认是
    autoScroll: {
      type: Boolean,
      default: true
    },
    // 适应侧边栏
    positionData: {
      type: Object,
      default() {
        return {
          min: 56,
          max: 180
        }
      }
    },
    // 是否编辑页面
    isEditPage: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // 监听侧边栏张开可关闭
    'sidebar.opened'(newVal) {
      if (newVal) {
        this.positionLeft = this.positionData.max
      } else {
        this.positionLeft = this.positionData.min
      }
    }
  },
  computed: {
    // 从vuex获取侧边栏状态
    ...mapGetters([
      'sidebar'
    ]),
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
    this.positionLeft = this.sidebar.opened ? this.positionData.max : this.positionData.min
  },
  methods: {
    // 页码改变
    currentChange(currentPage) {
      this.$emit('current-change', currentPage)
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
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
        scrollTo(0, 800)
      }
    }
  }
}

// import { mapGetters } from 'vuex'
// import { isArray } from 'lodash'

export default {
  name: 'PgOperations',
  props: {
    btns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    // ...mapGetters([
    //     'powers'
    // ]),
    limitList: {
      get() {
        // if (isArray(this.powers)) {
        //     return this.btns.filter((item) => this.powers.indexOf(item.name) > -1)
        // }
        // else {
        //     return this.btns;
        // }
        return this.btns
      }
    }
  },
  data() {
    return {
      selectAction: ''
    }
  },
  methods: {
    handleClick(btn) {
      if (btn.isConfirm) {
        this.$confirm('确定' + btn.name + '吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit(btn.action)
        }).catch(() => {

        })
      } else {
        this.$emit(btn.action)
      }
    },
    selectItem() {
      this.$emit(this.selectAction)
      this.selectAction = ''
    }
  }
}

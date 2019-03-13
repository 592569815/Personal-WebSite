import { cloneDeep } from 'lodash'
import { getValByKey, setValByKey } from '@/utils'

export default {
  name: 'PageSearch',
  props: {
    value: {
      type: Object,
      require: true
    },
    // 搜索菜单详细信息
    defaultForm: {
      type: Array,
      default() {
        return []
      }
    },
    // 重置表单数据
    resetForm: {
      type: Object
    }
  },
  data() {
    return {
      initForm: {}, // 重置表单数据
      selectArr: [], // 用于判断当前搜索项是否已存在
      serchInfoArr: [], // 搜索项
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setHours(0)
              start.setMinutes(0)
              start.setSeconds(0)
              end.setHours(23)
              end.setMinutes(59)
              end.setSeconds(59)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setHours(0)
              start.setMinutes(0)
              start.setSeconds(0)
              end.setHours(23)
              end.setMinutes(59)
              end.setSeconds(59)
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setHours(0)
              start.setMinutes(0)
              start.setSeconds(0)
              end.setHours(23)
              end.setMinutes(59)
              end.setSeconds(59)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setHours(0)
              start.setMinutes(0)
              start.setSeconds(0)
              end.setHours(23)
              end.setMinutes(59)
              end.setSeconds(59)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    /**
     * 用来双向绑定表单数据
     */
    form: {
      get() {
        return this.value
      },
      set(form) {
        this.$emit('input', form)
      }
    }
  },
  mounted() {
    this.initForm = cloneDeep(this.resetForm)
  },
  methods: {
    // 按下enter键，执行搜索
    handleKeyUp(e) {
      if (e.keyCode === 13) {
        this.request(null)
      }
    },
    // 触发父组件搜索事件
    search() {
      this.$emit('search')
    },
    // 搜索事件
    request(val) {
      this.watchQueryData(val)
      this.search()
    },
    // 判断搜索参数是否更改
    watchQueryData(val) {
      this.serchInfoArr = []
      this.selectArr = []
      Object.keys(this.form).forEach((k) => {
        if (this.form[k] !== this.initForm[k]) {
          if (typeof this.form[k] === 'string' && this.form[k].trim() === '') {
            return
          }
          if (this.selectArr.indexOf(k) === -1) {
            this.defaultForm.forEach((item, index) => {
              if (item.model === k) {
                const obj = cloneDeep(item)
                // 判断是否是日期选择
                if (k === 'time') {
                  if (this.form[k] && this.form[k].length === 2) {
                    // obj.value= `${this.form[item['start']].substring(0,10)}--${this.form[item['end']].substring(0,10)}`
                    obj.value = `${this.form[item['start']]}--${this.form[item['end']]}`
                    this.serchInfoArr.push(obj)
                    this.serchInfoArr.forEach((item) => {
                      this.selectArr.push(item.model)
                    })
                  }
                } else {
                  // val 主要用于 用户管理-组织架构 的树形图搜索
                  // obj.value= val?val:this.form[k]
                  obj.value = val && val.key === k ? val.val : item.valLabel ? item.valLabel : this.form[k]
                  this.serchInfoArr.push(obj)
                  this.serchInfoArr.forEach((item) => {
                    this.selectArr.push(item.model)
                  })
                }
              }
              if ((item.selectModel === k || item.inputModel === k) && item.type === 'group') {
                if (typeof this.form[item.inputModel] === 'string' && this.form[item.inputModel].trim() !== '') {
                  const selectObj = {
                    type: 'select',
                    defaultType: 'group-select',
                    label: item.selectLabel,
                    model: item.selectModel,
                    value: this.form[item.selectModel],
                    options: item.options
                  }
                  const inputObj = {
                    type: 'input',
                    defaultType: 'group-input',
                    label: item.inputLabel,
                    model: item.inputModel,
                    value: this.form[item.inputModel]
                  }
                  this.serchInfoArr.push(selectObj, inputObj)
                  this.serchInfoArr.forEach((item) => {
                    this.selectArr.push(item.model)
                  })
                }
              }
            })
          }
        }
      })
    },
    // 清除单项搜索
    closeItem(model, defaultType) {
      if (defaultType && defaultType === 'group-select') {
        this.serchInfoArr.forEach((item) => {
          if (item.defaultType && item.defaultType === 'group-input') {
            this.$emit('cleanSearchItem', item.model)
          }
        })
      } else {
        this.$emit('cleanSearchItem', model)
      }
      this.watchQueryData(null)
      this.search()
    },
    // 清除全部
    closeAll() {
      this.$emit('cleanSearchAll')
      this.serchInfoArr = []
      this.selectArr = []
      this.search()
    }
  },
  render(h) {
    /**
     * 表单render函数
     * @param  {[type]} form        [表单数据]
     * @param  {[type]} renderArray [需要渲染的表单列表]
     * @return {[type]}             [返回渲染的元素]
     */
    const formRender = (form, renderArray) => {
      if (renderArray && renderArray.length > 0) {
        return renderArray.map((item) => {
          switch (item.type) {
            // 单个输入框：必填属性model(绑定值字段),可配置属性placeholder
            case 'input':
              return <el-input
                style='width:150px'
                type='text'
                placeholder = { item.placeholder }
                value = { getValByKey(form, item.model) }
                on-input = { (val) => { setValByKey(form, item.model, val) } }>
              </el-input>
            // 下拉列表,必填字段 label(标题) model(绑定值字段),options(下拉列表数组),可配置属性 value(下拉列表选中时的返回值的key,原则上必填,如果不填,则将选中项的所有数据返回) text(下拉列表项显示文本的key,如果不填则取value或者item)
            case 'select':
              return <el-select size = { 'small' } filterable = { item.filterable } multiple = { item.multiple } style = {{ width: item.width ? item.width + 'px' : '104px' }}
                placeholder = { typeof item.placeholder === 'undefined' ? item.label : item.placeholder }
                value = { getValByKey(form, item.model) }
                on-input= { (val) => { setValByKey(form, item.model, val) } }>
                {
                  (() => {
                    const optionsList = item.options
                    if (optionsList && optionsList.length > 0) {
                      return optionsList.map((list) => {
                        return <el-option label = { getValByKey(list, item.text || item.value) } value ={ getValByKey(list, item.value) }></el-option>
                      })
                    }
                  })()
                }
              </el-select>
            // 下拉搜索组
            case 'group':
              return <div class = 'search_group'>
                <el-select size = { 'small' } filterable = { item.filterable } multiple = { item.multiple }
                  value = { getValByKey(form, item.selectModel) }
                  on-input = { (val) => { setValByKey(form, item.selectModel, val) } }>
                  {
                    (() => {
                      const optionsList = item.options
                      if (optionsList && optionsList.length > 0) {
                        return optionsList.map((list) => {
                          return <el-option label = { getValByKey(list, item.text || item.value) } value = { getValByKey(list, item.value) }></el-option>
                        })
                      }
                    })()
                  }
                </el-select>
                <el-input
                  style = 'width:150px'
                  type = 'text'
                  value = { getValByKey(form, item.inputModel) }
                  on-input = { (val) => { setValByKey(form, item.inputModel, val) } }>
                </el-input>
              </div>
            // 日期范围
            case 'timeRange':
              return <div class = 'time_tange'>
                <el-date-picker
                  size = { 'small' }
                  value = {getValByKey(form, item.model) }
                  on-input = {(val) => {
                    const startTime = val ? val[0] : ''
                    const endTime = val ? val[1] : ''
                    setValByKey(form, item.start, startTime)
                    setValByKey(form, item.end, endTime)
                    setValByKey(form, item.model, val)
                  }}
                  clearable = { false }
                  type = 'datetimerange'
                  value-format = { 'yyyy-MM-dd HH:mm:ss' }
                  default-time = { ['00:00:00', '23:59:59'] }
                  range-separator = ''
                  start-placeholder = '下单时间'
                  end-placeholder = ''
                  align = 'right'
                  style = 'width: 100%'
                  prefix-icon = 'iconfont icon-crm-rili'
                  picker-options = { this.pickerOptions }>
                </el-date-picker>
              </div>
          }
        })
      } else {
        return ''
      }
    }

    /**
     * 搜索项
     * @return {[type]} [description]
     */
    const searchItemRender = () => {
      if (this.serchInfoArr && this.serchInfoArr.length > 0) {
        return this.serchInfoArr.map((item, index) => {
          return <div class='selected_item'>
            <span class='selected_item_label'>{ item.label }:</span>
            {dataType(item)}
            <i class='iconfont icon-fontAwesome_remove guanbi' on-click = { () => this.closeItem(item.model, item.defaultType) }></i>
          </div>
        })
      } else {
        return ''
      }
    }

    const dataType = (data) => {
      if (data.type === 'select') {
        let obj = {}
        data.options.forEach((item) => {
          if (item.value === data.value) {
            obj = cloneDeep(item)
          }
        })
        return <span>{ obj.text }</span>
      } else {
        return <span>{ data.value }</span>
      }
    }

    return (
      <div class='search_component' on-keyup = { this.handleKeyUp }>
        <div class='default_condition'>
          { formRender(this.form, this.defaultForm) }
          <el-button size = 'mini' type = 'primary' class = 'search_btn' nativeOn-click = { () => this.request(null) }>搜索</el-button>
        </div>
        <div class = 'selected_condition' v-show = { this.serchInfoArr.length > 0 }>
          { searchItemRender() }
          <a href='javascript:;' class='cleanAll' on-click = { () => this.closeAll() }>清除全部</a>
        </div>
      </div>
    )
  }
}

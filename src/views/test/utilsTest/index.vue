<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UtilsTest',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    var db
    // 打开或新建test数据库
    var request = window.indexedDB.open('test', 2)
    request.onerror = function(event) {
      console.log('数据库打开报错')
    }
    request.onsuccess = function(event) {
      db = event.target.result
      console.log('数据库打开成功')
      // add({ id: 3, name: '张三', age: 35, email: 'zhangsan@163.com' })
      read(1)
      readAll()
    }
    // 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded。
    request.onupgradeneeded = function(event) {
      db = event.target.result
      var objectStore
      // 先判断一下，这张表格是否存在，如果不存在再新建person表
      if (!db.objectStoreNames.contains('person')) {
        // 新建person表，并设置id为主键, 指定主键为一个递增的整数。
        objectStore = db.createObjectStore('person', { keyPath: 'id' }, { autoIncrement: true })
        // IDBObject.createIndex()的三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）。
        // 新建索引 name能重复出现
        objectStore.createIndex('name', 'name', { unique: false })
        // 新建索引 email不能重复
        objectStore.createIndex('email', 'email', { unique: true })
      }
    }

    // 增
    // function add(data) {
    //   // 新建时必须指定表格名称和操作模式（"只读"或"读写"）。新建事务以后，通过IDBTransaction.objectStore(name)方法，拿到 IDBObjectStore 对象，再通过表格对象的add()方法，向表格写入一条记录。
    //   var request = db.transaction(['person'], 'readwrite')
    //     .objectStore('person')
    //     .add(data)
    //   // 写入操作是一个异步操作，通过监听连接对象的success事件和error事件，了解是否写入成功。
    //   request.onsuccess = function(event) {
    //     console.log('数据写入成功')
    //   }
    //   request.onerror = function(event) {
    //     console.log('数据写入失败')
    //   }
    // }

    // 读取
    function read(id) {
      var transaction = db.transaction(['person'])
      var objectStore = transaction.objectStore('person')
      // objectStore.get()方法用于读取数据，参数是主键的值
      var request = objectStore.get(id)
      request.onerror = function(event) {
        console.log('事务失败')
      }
      request.onsuccess = function(event) {
        if (request.result) {
          console.log(request.result)
        } else {
          console.log('未获得数据记录')
        }
      }
    }
    // 获取所有
    function readAll() {
      var objectStore = db.transaction('person').objectStore('person')
      // 新建指针对象的openCursor()方法是一个异步操作，所以要监听success事件
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result
        if (cursor) {
          console.log(cursor.value)
          cursor.continue()
        } else {
          console.log('没有更多数据了！')
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

<template>
  <div class="helloworld" @click.capture="randowColor">
    <slot></slot>
    <strong>Error! 测试</strong>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    value: {
      required: false,
      default: 5,
      type: Number
    }
  },
  data() {
    return {
      arr: [0]
      // currentPage: 0
    }
  },
  methods: {
    randowColor(e) {
      const r = parseInt(Math.random() * (255 - 1 + 1) + 1)
      const g = parseInt(Math.random() * (255 - 1 + 1) + 1)
      const b = parseInt(Math.random() * (255 - 1 + 1) + 1)
      e.target.style.background = `rgba(${r}, ${g}, ${b}`
      // e.target.style.color = `rgba(${r}, ${g}, ${b}`
    }
  }
}
</script>

<style lang="scss">
.helloworld {
  color: red;
  background: #efefef;
  padding: 20px;
}
</style>

<!-- MaterialIcon.vue -->
<template>
  <span 
    class="material-symbols-outlined"
    :style="iconStyle"
  >
    {{ name }}
  </span>
</template>

<script>
export default {
  name: 'MaterialIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 24
    },
    fill: {
      type: Number,
      default: 0
    },
    weight: {
      type: Number,
      default: 400
    }
  },
  computed: {
    iconStyle() {
      return {
        'font-variation-settings': `'FILL' ${this.fill}, 'wght' ${this.weight}, 'GRAD' 0, 'opsz' ${this.size}`,
        'font-size': `${this.size}px`
      }
    }
  }
}
</script>

<style scoped>

</style>
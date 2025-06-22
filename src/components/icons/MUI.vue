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
      default: 24
    },
    fill: {
      default: 0
    },
    weight: {
      default: 400
    }
  },
  computed: {
    iconStyle() {
      return {
        'font-variation-settings': `'FILL' ${Number(this.fill)}, 'wght' ${Number(this.weight)}, 'GRAD' 0, 'opsz' ${Number(this.size)}`,
        'font-size': `${Number(this.size)}px`
      }
    }
  }
}
</script>

<style scoped>

</style>
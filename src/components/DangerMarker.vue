<template>
  <span>
    <slot v-if="isDanger" name="danger" :mark="text"></slot>
    <slot v-if="!isDanger" name="simple" :mark="text"></slot>
  </span>
</template>

<script>
export default {
  name: "DangerMarker",
  props: {
    text: String,
  },
  computed: {
    isDanger() {
      return /срочно/gi.test(this.text);
    },
  },
};
</script>

<style>
</style>
